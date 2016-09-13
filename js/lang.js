(function (root) {

    function extend(o1, o2){
        for (var k in o2) {
            o1[k] = o2[k]
        }
    }


    /****
     * location
     */

    var location = root.location;
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
        extend(map, map2);
        for (k in map)
            map[k] && search.push(k+'='+map[k])
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

    /**
     * Number
     */
    Number.prototype.toFixed2 = function (fractionalDigits, notKeepZero) {
        var fixedNum = this,
            _fd = fractionalDigits;
        if (this % 1 && fractionalDigits) {
            var num = 1;
            while (fractionalDigits-- > 0) {
                num *= 10;
            }
            fixedNum = Math.round(this * num ) / num;
        }
        return notKeepZero ? fixedNum : fixedNum.toFixed(_fd);
    };
})(window);
