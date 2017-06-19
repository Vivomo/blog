;~function() {

    var tipsData = ['美好的一天从早上开始！', '该是吃中饭的时间了', '忙碌了一天，注意休息啊！'],
        num = 0,
        counter = 3,
        counterTimer = null,
        audio = document.createElement('audio');

    audio.setAttribute('src', 'notifications.mp3');

    setInterval(function() {

        audio.play();

        counter = 3;

        num = Math.floor(tipsData.length*Math.random());

        chrome.notifications.create('123', {
            type: 'basic',
            iconUrl: '../tips.jpg',
            title: '提示',
            message: tipsData[num],
            contextMessage: '3s后自动关闭',
            buttons: [
                {
                    title: '底部栏的一些说明',
                    iconUrl: '../footer.png'
                }
            ]
        }, function() {
            counterTimer= setInterval(function() {
                counter -= 1;
                chrome.notifications.update('123', {
                    contextMessage: counter+ 's后自动关闭'
                })
                if(counter == 0){
                    clearInterval(counterTimer);
                    chrome.notifications.clear('123');
                }
            }, 1000);
        });

    }, 8000);

}()