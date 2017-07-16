(function () {

    var block = {
        "coding.imooc.com" :function (){
            var style = document.createElement('style');
            style.innerText =  ' .next-mask.in, #video-container-mocoplayer-hls-video > [class]{ z-index:1000;background:#000} ';
            document.head.appendChild(style);
        },
        "lpl.qq.com": function () {
            var style = document.createElement('style');
            style.innerText = `.data-teamvs .match-score {
                opacity: 0.001;
            }
            .data-teamvs .match-score:hover {
                opacity: 1;
            }
            `;
            document.head.appendChild(style);
        },
        "www.google.com": function () {
            var style = document.createElement('style');
            style.innerText = `#theme-attr-msg,#theme-attr-img, #most-visited {
                opacity: 0;
            }
            .data-teamvs .match-score:hover {
                opacity: 1;
            }
            `;
            document.head.appendChild(style);
        }
    };
    var host = location.host;

    if (host in block) {
        block[host]();
    }
})();