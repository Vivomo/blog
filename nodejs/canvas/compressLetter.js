const fs = require('fs');

let RLE = (str) => {
    let result = [];
    let temp = str[0];
    let count = 1;
    for (let i = 1; i < str.length; i++) {
        if (str[i] === temp) {
            count ++;
        } else {
            result.push(temp + '' + count);
            temp = str[i];
            count = 1;
        }
    }
    result.push(temp + '' + count);
    return result.join('');
};

let letterList = fs.readFileSync('D:\\code\\git\\blog\\ignore\\letter.txt', 'utf-8').split('\n');
console.log(letterList.length);

let compressLetterList = letterList.map((line) => {
    if (!line) {
        return;
    }
    let compressLine = RLE(line);
    if (line.length > compressLine.length) {
        return 'R' + compressLine;
    } else {
        return 'H' + line;
    }
});

fs.writeFileSync('D:\\code\\git\\blog\\ignore\\letterRLE.txt', compressLetterList.join('\n'));