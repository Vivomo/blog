(function () {

    var block = {
        "coding.imooc.com" : function (){
            var style = document.createElement('style');
            style.innerText =  ' .next-mask.in, #video-container-mocoplayer-hls-video > [class]{ z-index:1000;background:#000} ';
            document.head.appendChild(style);
        }
    };
    var host = location.host;

    if (host in block) {
        block[host]();
    }
})();