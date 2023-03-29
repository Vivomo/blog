const path = require('path');
const fs = require('fs');

const {getFilesByPath} = require('../nodejs/util/fileUtil');

const postPath = '../_posts';
const tagsReg = /tags:(.+)/;
const titleReg = /title:(.+)/;
const tagMap = {};

const posts = getFilesByPath(postPath);

posts.forEach((post) => {
  const content = fs.readFileSync(post, 'utf-8');
  const lines = content.split('\n');
  let markCount = 0;
  let title, tags;
  lines.some((item, index) => {
    const line = item.trim();
    if (markCount === 1) {
      if (!tags) {
        let tagResult = tagsReg.exec(line);
        if (tagResult) {
          tags = tagResult[1].split(',').map(tag => tag.trim());
        }
      }
      if (!title) {
        let titleResult = titleReg.exec(line);
        if (titleResult) {
          title = titleResult[1].trim();
        }
      }
    }
    if (line === '---') {
      markCount += 1;
    }
    return markCount === 2;
  });
  if (tags) {
    tags.forEach((tag) => {
      if (tagMap[tag]) {
        tagMap[tag].push(title)
      } else {
        tagMap[tag] = [title];
      }
    });
  }
});
const tagsContent = `window.BlogTags = ${JSON.stringify(tagMap)}`
fs.writeFileSync(path.join(__dirname, '../static/js/tags.js'), tagsContent);

