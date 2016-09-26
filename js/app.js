/**
 * Created by ui on 2016/9/26.
 */

(function () {
    var pageData = JSON.parse(document.getElementById('page_data').value),
        siteData = document.getElementById('site_data').dataset;

    if (pageData.js) {
        V.loadJS(siteData.baseurl + '/js/' + pageData.js + '.js')
    }
})();