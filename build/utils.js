
exports.parseScript = (dom) => {
    let script = dom.querySelector('script');
    if (script) {
        let src = script.getAttribute('src');
        let result = /(\w|-)+\.js/.exec(src);
        script.remove();
        return result && result[0];
    }
    return null;
};

exports.parseCSS = (dom) => {
    let css = dom.querySelector('link');
    return css && css.getAttribute('href');
};

exports.parseBodyData = (dom) => {
    return dom.body.dataset;
};

exports.parseViewport = (dom) => {
    let viewport = dom.querySelector('[name="viewport"]');
    return viewport && viewport.getAttribute('content');
};

exports.createBlog = (blog) => {
    return `
---
layout: ${blog.layout}
viewport: ${blog.viewport}
title: ${blog.title}
css: ${blog.css}
js: ${blog.js}
---
${blog.content}     
   `
};