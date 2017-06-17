(function () {

    setTimeout(function () {
        new Notification('Title', {
            body : 'I am a Notification',
            icon : './images/test1.png'
        });
    }, 5000);
})();