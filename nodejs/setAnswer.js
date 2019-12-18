const fs = require('fs');

let ordReg = /^\d+/;
let answerReg = /\((\w+)\)/;
let optionIndex = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6
};

let fileContent = fs.readFileSync('G:\\git\\blog\\ignore\\setAnswer.txt', 'utf-8');
let fileLines = fileContent.split('\n');
let result = [];

// console.log(fileLines);
fileLines.forEach((line, lineIndex) => {
    if (ordReg.test(line)) {
        let answerResult = answerReg.exec(line);
        if (answerResult) {
            let answerStr = answerResult[1];
            let answerContent = '';
            for (let i = 0; i < answerStr.length; i++) {
                let answerIndex = optionIndex[answerStr[i]];
                answerContent += fileLines[lineIndex + answerIndex].trim();
            }
            result.push(line.replace(answerStr, answerContent).replace(/\t/g, ''));
        }
    }
});

fs.writeFileSync('G:\\git\\blog\\ignore\\result.txt', result.join(''));
// console.log(result)