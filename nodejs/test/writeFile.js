const fs = require('fs');

// fs.writeFile('../../ignore/test.txt', '123', (err) => {
//     if (!err) {
//         console.log('write');
//     }
// });

// let r = fs.mkdirSync('../../ignore/step/a');
// console.log(r)
let b = fs.existsSync('D:\\code\\git\\blog\\ignore\\step\\朋友们的第5话-娜琏专属的道歉方法\\11.jpg');
console.log(b)

let stat = fs.statSync('D:\\code\\git\\blog\\ignore\\step\\朋友们的第5话-娜琏专属的道歉方法\\11.jpg')
console.log(stat);