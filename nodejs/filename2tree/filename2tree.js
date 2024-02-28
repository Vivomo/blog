const fs = require('fs');
const path = require('path')

const filepath = 'D:\\code\\web3\\mississippi\\packages\\client\\src\\assets\\img\\hero';
const json = {};
const files = fs.readdirSync(filepath);
files.forEach((file) => {
  const filePath = path.join(filepath, file);
  const stat = fs.lstatSync(filePath);
  if (stat.isDirectory()) {
    json[file] =getPngFiles(filePath);
  }
});

function getPngFiles(root) {
  let files = fs.readdirSync(root);
  return files.filter((file) => {
    return file.endsWith('.png');
  }).map(item => item.replace('.png', ''));
}

console.log(json);