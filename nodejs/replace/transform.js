const ts = require('typescript');
const fs = require('fs');

// https://ts-ast-viewer.com/
// https://zhuanlan.zhihu.com/p/145278299

const sourceFile = ts.createSourceFile(
    'example',
    fs.readFileSync('./example.tsx', 'utf8'),
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
);

function changesVisitor (node) {
    if (node.kind === 204) {
        console.log(node)
    }
    ts.forEachChild(node, changesVisitor)
}

ts.forEachChild(sourceFile, changesVisitor)

