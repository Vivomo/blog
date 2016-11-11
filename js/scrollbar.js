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
    };
    
    Scrollbar.prototype = {
        constructor : Scrollbar,
        initCss : function () {
            var $wrap = this.$wrap = $(this.selector);
            if ($wrap.css('position') == 'static') {
                $wrap.css('position', 'relative');
            }
        },
        init : function () {
            
        }
    }
})();
