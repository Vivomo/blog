

var $$ = function (selector) {
    return [].slice.call(document.querySelectorAll(selector));
};
var Report = (function () {
    var $page = $('.page'),
        $clubName = $('#club-name'),
        $start = $('#start');

    function animated($elem) {
        $elem.addClass($elem.data('animate'));
    }

    return {
        initedSections : [],
        start : function () {
            animated($clubName);
            setTimeout(function () {
                animated($start);
            }, 1000);
        },
        initSection : function (name) {
            if (this.initedSections.indexOf(name) == -1) {
                this[name] && this[name]();
                this.initedSections.push(name);
            }
        },
        init : function () {
            $('#wrap').fullpage({
                afterLoad : function (a, index) {
                    var _$page = $page.eq(index-1);
                    Report.initSection([_$page.data('name')]);
                }
            })
        }
    }
})();

Report.init();
