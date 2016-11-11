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
        $.extend(this, option);
        this.init();
    };
    
    Scrollbar.prototype = {
        constructor : Scrollbar,
        initWrap : function () {
            var $wrap = this.$wrap = $(this.selector);
            if ($wrap.css('position') == 'static') {
                $wrap.css('position', 'relative');
            }
            $wrap.css({
                overflow : 'hidden'
            })
        },
        initBar : function () {
            var $content = this.$content = this.$wrap.find(this.content),
                $bar = this.$bar = this.$wrap.find(this.bar),
                wrapHeight = $wrap.height(),
                contentHeight = $content.height();
            if (contentHeight <= wrapHeight) {
                $bar.hide();
                this.ended = true;
            } else {
                $bar.height(100 * wrapHeight / contentHeight + '%')
            }
        },
        initStyle : function () {
            this.initWrap();
            this.initBar();
        },
        initMouse : function () {
            if (this.ended) {
                return false;
            }
            if (window.addEventListener) {
                this.$wrap.each(function () {
                    this.addEventListener("DOMMouseScroll", function(e) {
                        handleMousewheel(e);
                    })
                })
            }

            this.$wrap.each(function () {
                this.onmousewheel = handleMousewheel;
            });

            function handleMousewheel(e) {
                e = e || event;
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
                var type = e.type;
                if (type == 'DOMMouseScroll' || type == 'mousewheel') {
                    // down: 1   up: -1
                    e.delta = (e.wheelDelta) ? -e.wheelDelta / 120 : (e.detail || 0) / 3;
                }
            }
        },
        init : function () {
            this.ended = false;
            this.initStyle();
            this.initMouse();
        }
    }
})();
