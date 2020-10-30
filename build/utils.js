const path = require('path');

exports.parseScript = (dom) => {
    let script = dom.querySelector('script');
    if (script) {
        let src = script.getAttribute('src');
        script.remove();
        return path.basename(src);
    }
    return null;
};

exports.parseCSS = (dom) => {
    let css = dom.querySelector('link');
    return css && path.basename(css.getAttribute('href'));
};

exports.parseBodyData = (dom) => {
    return dom.body.dataset;
};

exports.parseViewport = (dom) => {
    let viewport = dom.querySelector('[name="viewport"]');
    return viewport && viewport.getAttribute('content');
};

exports.parseContent = (content) => {
    return content.replace(/src="\.\.\/img\/([^"]+)"/, 'src={{site.cname}}src/img/$1')
}

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