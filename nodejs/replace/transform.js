const ts = require('typescript');
const fs = require('fs');
const mapStream = require('map-stream');
const vfs = require('vinyl-fs');

const SyntaxKind = ts.SyntaxKind;

// https://ts-ast-viewer.com/
// https://zhuanlan.zhihu.com/p/145278299

const translateJSON = {
    value: '值',
    'obj-data': '对象数据value: {value} 数字: {num}',
    alert: '弹出',
    msg: '消息',
    title: '标题',
    'data-msg': '消息数据{name}',
    '123': '123 {easy} num: {num}',
    '1234': '1234',
}

const isFormatNode = (node) => {
    return node.kind === SyntaxKind.Identifier
    && node.escapedText === 'format'
    && node.parent.kind === SyntaxKind.CallExpression
}

const addTargetParam = (target, node, fileContent) => {
    let param = {};
    let props = node.parent.arguments[1].properties;
    props.forEach((prop) => {
        let key = prop.name.escapedText.trim();
        let value;
        if (prop.kind === SyntaxKind.ShorthandPropertyAssignment) {
            value = key;
        } else {
            value = fileContent.substring(prop.initializer.pos, prop.initializer.end).trim();
        }
        param[key] = value;
    });
    target.param = param;
}

const dealTargetPos = (target, node, content) => {
    if (target.kind === SyntaxKind.PropertyAssignment || target.kind === SyntaxKind.VariableDeclaration) {
        if (content[target.pos] === ' ') {
            target.pos++;
        }
    } else if (target.kind === SyntaxKind.JsxExpression) {
        const wrap = node.parent.parent;
        const block = wrap.parent;
        target.blockKind = block.kind;
        if (block.kind === SyntaxKind.JsxElement) {
            target.pos = wrap.pos;
            target.end = wrap.end;
        } else if (block.kind === SyntaxKind.JsxAttribute) {
            if (!target.param) {
                target.pos = wrap.pos;
                target.end = wrap.end;
            }
        } else {
            console.error('不明情况', target, node);
        }
    }
}

const template = (str, param, es6Temp = false) => {
    let leftSymbol = es6Temp ? '${' : '{';
    for (let k in param) {
        let reg = new RegExp('\{' + k + '}', 'g');
        let replaceStr = leftSymbol + param[k] + '}'
        str = str.replace(reg, replaceStr)
    }
    return str;
}

const translate = (content, targetList) => {
    let cursor = 0;
    const translateContent = [];
    targetList.forEach((target) => {
        translateContent.push(content.substring(cursor, target.pos));
        let translateStr;
        let str = translateJSON[target.id];
        if (target.kind === SyntaxKind.JsxExpression) {
            if (target.blockKind === SyntaxKind.JsxAttribute) {
                if (target.param) {
                    translateStr = `\`${template(str, target.param, true)}\``;
                } else {
                    translateStr = `"${str}"`;
                }
            } else {
                if (target.param) {
                    translateStr = template(str, target.param);
                } else {
                    translateStr = str;
                }
            }
        } else {
            if (target.param) {
                translateStr = `\`${template(str, target.param, true)}\``;
            } else {
                translateStr = `'${str}'`;
            }
        }

        translateContent.push(translateStr);
        cursor = target.end;
    });
    translateContent.push(content.substring(targetList[targetList.length - 1].end))
    return translateContent.join('');
}


const translateTask = (fileContent) => {
    const sourceFile = ts.createSourceFile(
        'example',
        fileContent,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
    );
    const targetList = [];
    const findTarget = (node) => {
        if (isFormatNode(node)) {
            const id = node.parent.arguments[0].properties[0].initializer.text;
            let target = {
                id,
                pos: node.parent.pos,
                end: node.parent.end,
                kind: node.parent.parent.kind
            }
            if (node.parent.arguments[1]) {
                addTargetParam(target, node, fileContent);
            }
            dealTargetPos(target, node, fileContent);
            targetList.push(target)
        }
        ts.forEachChild(node, findTarget)
    }

    ts.forEachChild(sourceFile, findTarget);

    return translate(fileContent, targetList);
}


const test = (file, cb) => {
    const fileContent = file.contents.toString();
    const translateContent = translateTask(fileContent);
    file.contents = Buffer.from(translateContent, 'utf8');
    cb(null, file);
}

vfs.src('../ignore/a/example[12].tsx', {base: './'})
    .pipe(mapStream(test))
    .pipe(vfs.dest('./'), { overwrite: true })
