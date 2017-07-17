chrome.tabs.query({
    active: true
}, function(tabs) {
    var tab = tabs[0];
    var myTabUrl = tab.url;
    document.querySelector('#qr-code').innerHTML = JSON.stringify(tab, '****');
});
