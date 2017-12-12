(function () {
    var jsPath = eval(pageJS);

    if (jsPath) {
        if (Array.isArray(jsPath)) {
            jsPath.forEach(path => V.loadJS(baseUrl + '/js/' + path + '.js'))
        } else if(typeof jsPath == 'string') {
            V.loadJS(baseUrl + '/js/' + jsPath + '.js');
        }
    }
})();