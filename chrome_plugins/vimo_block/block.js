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
            style.innerText =
                `#theme-attr-msg,#theme-attr-img, #most-visited {
                    opacity: 0;
                    pointer-events: none;
                }`;
            document.head.appendChild(style);
        },
        "www.panda.tv": function () {
            console.log('load end')
            if (location.href.match("http://www.panda.tv/lpl")) {
                [].slice.call(document.querySelectorAll('iframe')).forEach(function (iframe) {
                    var style = document.createElement('style');
                    style.innerText =
                        `.room-chat-container .room-chat-scroller .room-chat-item { color: transparent; }
                         .room-chat-special-tips {display: none}   
                        `;
                    iframe.onload = function () {
                        iframe.contentDocument.head.appendChild(style);
                    }
                });

            }
        },
        "segmentfault.com": function () {

            var style = document.createElement('style');
            style.innerText =
                `.widget-register {
                    opacity: 0;
                    display: none!important;
                }`;
            document.head.appendChild(style);
        }
    };
    var host = location.host;

    if (host in block) {
        block[host]();
    }
})();