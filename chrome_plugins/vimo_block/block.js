(function () {

    var block = {
        "coding.imooc.com" : function (){
            var style = document.createElement('style');
            style.innerText =  ' .video-js .vjs-tech{ z-index:1000;} ';
            document.head.appendChild(style);
        }
    };
    var host = location.host;

    if (host in block) {
        block[host]();
    }
})();