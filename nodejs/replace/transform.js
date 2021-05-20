const ts = require('typescript');
const fs = require('fs');

// https://ts-ast-viewer.com/
// https://zhuanlan.zhihu.com/p/145278299

const fileContent = fs.readFileSync('./example.tsx', 'utf8');
const sourceFile = ts.createSourceFile(
    'example',
    fileContent,
    ts.ScriptTarget.Latest,
    /*setParentNodes */ true,
    ts.ScriptKind.TSX
);

const isFormatNode = (node) => {
    return node.kind === ts.SyntaxKind.Identifier
    && node.escapedText === 'format'
    && node.parent.kind === ts.SyntaxKind.CallExpression
}

let count = 0;
const targetList = [];
function changesVisitor (node) {
    if (isFormatNode(node)) {
        const id = node.parent.arguments[0].properties[0].initializer.text;
        let target = {
            id,
            pos: node.parent.pos,
            end: node.parent.end
        }
        if (node.parent.arguments[1]) {
            let param = {};
            let props = node.parent.arguments[1].properties;
            props.forEach((prop) => {
                let key = prop.name.escapedText.trim();
                let value;
                if (prop.kind === ts.SyntaxKind.ShorthandPropertyAssignment) {
                    value = key;
                } else {
                    value = fileContent.substring(prop.initializer.pos, prop.initializer.end).trim();
                }
                param[key] = value;
            });
            target.param = param;
        }
        targetList.push(target)
        // console.log(node)
        count++;
        // console.log(fileContent.substring(node.pos, node.end));
        // console.log(fileContent.substring(node.parent.pos, node.parent.end));
    }
    // console.log(fileContent.substring(node.pos, node.end), node.kind)
    ts.forEachChild(node, changesVisitor)
}

ts.forEachChild(sourceFile, changesVisitor)

console.log(targetList)
console.log(count)