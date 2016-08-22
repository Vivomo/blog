(function (root) {
    /****
     * location
     */

    location.searchMap = function(search){
        search = search || location.search;
        if (!search){
            return {};
        }

        var hashArr = search.replace('?','').split('&');
        var hashMap = {};
        for (var i = 0; i < hashArr.length; i++) {
            var tempArr = hashArr[i].split('=');
            hashMap[decodeURIComponent(tempArr[0])] = decodeURIComponent(tempArr[1]);
        }
        return hashMap;
    };
    location.concatUrl = function (url, map) {
        var a = document.createElement('a');
        a.href = url;
        url = a.pathname;
        var search = [],
            map2 = location.searchMap(a.search), k;
        for (k in map)
            map[k] && search.push(k+'='+map[k])
        for (k in map2)
            map2[k] && search.push(k+'='+map2[k])
        return url + '?' + search.join('&');
    };
    location.skipUrl = function(url, map) {
        location.href = location.concatUrl(url, map);
    };
    location.goUrlBack = function(name){
        var hashMap = location.searchMap();
        var url = hashMap[name || 'url'];
        if (url) {
            location.href = url;
        } else {
            window.history.back();
        }
    };

    location.login = function(url){
        location.href = '/m/login'+(url?'?url='+ encodeURIComponent(url) : '');
    };
})(window);
