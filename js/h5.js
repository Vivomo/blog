/**
 * Created by ui on 2016/9/12.
 */


function Printer(cfg) {

    if (this.constructor != Printer) {
        return new Printer(cfg)
    }
    this.cfg = $.extend({
        pauseTime : 40,//ms
        tag : 'span',
        callback : null
    }, cfg);
}

Printer.prototype = {
    constructor : Printer,
    write : function (cursor, word) {
        cursor.style.display = 'inline-block';
        var i = 0;
        var interval = setInterval(function () {
            if (i >= word.length) {
                cursor.style.display = 'none';
                return clearInterval(interval);
            }
            this.pushLetter(cursor, word[i++]);
        }.bind(this), this.cfg.pauseTime)
    },
    pushLetter : function (cursor, letter) {
        var elem = document.createElement(this.cfg.tag);
        elem.innerText = letter;
        cursor.parentNode.insertBefore(elem, cursor);
    }

};

(function () {
    $('#wrap').fullpage();

})();