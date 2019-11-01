
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