/**
 * 基于zepto/jQuery的仿Marquee插件  (wap)
 * @param cfg
 * @constructor
 */
function Marquee(cfg) {

}

Marquee.H = 1;
Marquee.V = 2;

Marquee.prototype = {
    constructor : Marquee,
    direction : Marquee.H,
    speed : 100, // 每秒移动的像素
    loop : true,
    wrap : null,
    scroll : function () {

    },
    init : function () {
        var $wrap = $(this.wrap);
        var $content = $wrap.children();

        if (this.direction == Marquee.H) {
            if ($content.width() > $wrap.width()) {
                $wrap.append($content.clone());
                this.scroll();
            }
        } else {
            //TODO
        }
    }
};

new Marquee({});
