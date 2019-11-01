
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

exports.parseBodyData = (dom) => {
    return dom.body.dataset;
};

exports.parseViewport = (dom) => {
    let viewport = dom.querySelector('[name="viewport"]');
    return viewport && viewport.getAttribute('content');
};