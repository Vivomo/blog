const fs = require('fs');
let frames = fs.readFileSync('D:\\code\\git\\blog\\ignore\\buffer.b');
let prev = frames.slice(0, 432);
let diffLines = [prev];
let newFrames = [prev];
const H = 'H';
const D = 'D';
const R = 'R';

prev[0] = 1;

console.log(prev);

// const frameCount = 6569;
//
// for (let i = 1; i < frameCount; i++) {
//     let current = letterList[i];
//     if (current.length === prev.length) {
//         if (prev === current) {
//             diffLines.push(D);
//             continue;
//         }
//         if (prev[0] === H && current[0] === H) {
//             let diffResult = [];
//             for (let s = 1; s < prev.length; s++) {
//                 if (prev[s] !== current[s]) {
//                     diffResult.push(`${current[s]}${s - 1}`);
//                 }
//             }
//             let diffStr = D + diffResult.join('');
//             if (diffStr.length < current.length) {
//                 diffLines.push(diffStr)
//             } else {
//                 diffLines.push(current);
//             }
//         }
//     } else {
//         diffLines.push(current);
//     }
//     prev = current;
// }