/**
 * Created by ui on 2016/9/26.
 */

(function () {
    var data = document.getElementById('data').dataset;

    if (data.js) {
        V.loadJS(data.baseurl + '/js/' + data.js + '.js')
    }
})();