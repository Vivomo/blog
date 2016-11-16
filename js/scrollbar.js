(function () {

    window.Scrollbar = function(selector, option) {
        if (this.constructor != Scrollbar) {
            return new Scrollbar(selector, option);
        }
        if (typeof selector != 'string') {
            option = selector
        } else {
            this.selector = selector;
        }
        var defaultOption = {
            barWrap : '.scroll-bar-wrap'
        };
        $.extend(this, defaultOption, option);
        this.init();
    };

    Scrollbar.UP = -1;
    Scrollbar.BOTTOM = 1;
    Scrollbar.step = 40;


    Scrollbar.prototype = {
        constructor : Scrollbar,
        noscroll : [],
        setBarTop : function (top, index) {
            var $barWrap = this.$barWrap.eq(index),
                $bar = this.$barWrap.eq(index).children();

            $bar.css('top', top * $barWrap.height() / this.$wrap[index]._scrollHeight + 'px');
        },
        initStyle : function () {

            var $wrap = this.$wrap = $(this.selector),
                $barWrap = this.$barWrap = $(this.barWrap),
                that = this;
            $wrap.css({
                overflow : 'hidden'
            }).filter(function () {
                return $(this).css('position') == 'static';
            }).css('position', 'relative');

            this.noscroll = new Array($wrap.length);

            $barWrap.each(function (index) {
                var contentHeight = $wrap[index].scrollHeight,
                    wrapHeight = $wrap.eq(index).height(),
                    noscroll = contentHeight == wrapHeight;

                $wrap[index]._scrollHeight = contentHeight;
                that.noscroll[index] = noscroll;
                if (!noscroll) {
                    $barWrap.eq(index).show().children().height(100 * wrapHeight / contentHeight + '%');
                }
            });
        },
        initMouse : function () {
            var that = this;
            if (window.addEventListener) {
                this.$wrap.each(function (index) {
                    this.addEventListener("DOMMouseScroll", function(e) {
                        that.handleMousewheel(e, index);
                    },false)
                })
            }

            this.$wrap.each(function (index) {
                this.onmousewheel = function (e) {
                    that.handleMousewheel(e, index)
                };
            });
        },
        handleMousewheel : function (e, index) {
            if (this.noscroll[index]) {
                return;
            }
            e = e || event;
            var type = e.type;
            if (type == 'DOMMouseScroll' || type == 'mousewheel') {
                // down: 1   up: -1
                var direction = (e.wheelDelta) ? -e.wheelDelta / 120 : (e.detail || 0) / 3;
                var wrap = this.$wrap[index]
                if ( (direction == Scrollbar.UP && wrap.scrollTop != 0) ||
                    (direction == Scrollbar.BOTTOM && wrap.scrollTop + wrap.clientHeight < wrap._scrollHeight)) {
                    wrap.scrollTop += direction * Scrollbar.step;
                    this.setBarTop(wrap.scrollTop, index);
                    if (e.preventDefault) {
                        e.preventDefault();
                    } else {
                        window.event.returnValue = false;
                    }
                }
            }
        },
        init : function () {
            this.initStyle();
            this.initMouse();
        }
    }

    new Scrollbar('.scroll-wrap');

})();