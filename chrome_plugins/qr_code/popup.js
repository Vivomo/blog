chrome.tabs.query({
    active: true
}, function (tabs) {
    var tab = tabs[0];
    $('#qr-code').qrcode({
        width: 200,
        height: 200,
        text: tab.url
    });
});
