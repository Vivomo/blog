const path = require('path');

exports.parseScript = (dom) => {
    let jsList = Array.from(dom.querySelectorAll('script'));
    let srcList = jsList.map((script) => {
        let src = script.getAttribute('src');
        if (src.startsWith('http')) {
            return src;
        } else {
            // TODO 支持内联js
            return path.basename(src);
        }
    }).join(',');
    jsList.forEach(script => script.remove());
    return srcList;
};

exports.parseCSS = (dom) => {
    let cssList = Array.from(dom.querySelectorAll('link'));
    return cssList.map((css) => {
        let href = css.getAttribute('href');
        if (href.startsWith('http')) {
            return href;
        } else {
            return path.basename(href);
        }
    }).join(',');
};

exports.parseBodyData = (dom) => {
    return dom.body.dataset;
};

exports.parseViewport = (dom) => {
    let viewport = dom.querySelector('[name="viewport"]');
    return viewport && viewport.getAttribute('content');
};

exports.parseContent = (content) => {
    return content.replace(/src="\.\.\/img\/([^"]+)"/, 'src="{{site.cname}}src/img/$1"')
};

exports.createBlog = (blog) => {
    return `
---
layout: ${blog.layout || 'new-blank'}
viewport: ${blog.viewport}
title: ${blog.title}
css: ${blog.css}
js: ${blog.js}
---
${blog.content}     
   `.trim();
};