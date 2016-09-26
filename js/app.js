/**
 * Created by ui on 2016/9/26.
 */

(function () {
    var dataElem = document.getElementById('data'),
        page_data = JSON.parse(dataElem.value),
        site_data = document.getElementById('site_data').dataset;

    if (page_data.js) {
        V.loadJS(site_data.baseurl + '/js/' + page_data.js + '.js')
    }
})();