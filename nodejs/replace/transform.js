const ts = require('typescript');
const fs = require('fs');

function delint(sourceFile) {
    delintNode(sourceFile);

    function delintNode(node) {
        switch (node.kind) {
            case ts.SyntaxKind.ForStatement:
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.WhileStatement:
            case ts.SyntaxKind.DoStatement:
                if ((node).statement.kind !== ts.SyntaxKind.Block) {
                report(
                    node,
                    'A looping statement\'s contents should be wrapped in a block body.'
                );
            }
                break;

            case ts.SyntaxKind.IfStatement:
                const ifStatement = node;
                if (ifStatement.thenStatement.kind !== ts.SyntaxKind.Block) {
                    report(ifStatement.thenStatement, 'An if statement\'s contents should be wrapped in a block body.');
                }
                if (
                    ifStatement.elseStatement &&
                    ifStatement.elseStatement.kind !== ts.SyntaxKind.Block &&
                    ifStatement.elseStatement.kind !== ts.SyntaxKind.IfStatement
                ) {
                    report(
                        ifStatement.elseStatement,
                        'An else statement\'s contents should be wrapped in a block body.'
                    );
                }
                break;

            case ts.SyntaxKind.BinaryExpression:
                const op = (node).operatorToken.kind;
                if (op === ts.SyntaxKind.EqualsEqualsToken || op === ts.SyntaxKind.ExclamationEqualsToken) {
                    report(node, 'Use \'===\' and \'!==\'.');
                }
                break;
        }

        ts.forEachChild(node, delintNode);
    }

    function report(node, message) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
    }
}

// Parse a file
const fileName = './ignore/simple.tsx'
const sourceFile = ts.createSourceFile(
    fileName,
    fs.readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
);

// delint it
delint(sourceFile);