/**
 * Created by ui on 2016/9/29.
 */

function Printer(cfg) {

    if (this.constructor != Printer) {
        return new Printer(cfg)
    }

    function extend(o1, o2) {
        for (var k in o2) {
            o1[k] = o2[k]
        }
        return o1;
    }
    extend(this, cfg);

    this.queue = [];

    if (this.audioId) {
        this.audio = document.getElementById(this.audioId);
    }

    var tag = this.tag;
    this.createElement = tag ?  function (l) {
        var elem = document.createElement(tag);
        elem.innerText = l;
        return elem;
    } : function (l) {
        return document.createTextNode(l);
    }
}

Printer.prototype = {

    constructor : Printer,
    pauseTime : 200,//ms
    audioId : '',
    tag : '',
    isWriting : false,
    start : function () {
        this.audio && this.audio.play();
        var interval = setInterval(function () {
            var next = this.queue.shift();
            if (next) {
                switch (typeof next){
                    case 'string':
                        this.pushLetter(next);
                        break;
                    case 'function':
                        next();
                }
            } else {
                clearInterval(interval);
                this.cursor.style.display = 'none';
            }

        }.bind(this), this.pauseTime)
    },
    switchCursor : function (cursor) {
        this.cursor && (this.cursor.style.display = 'none');
        // this.audio && this.audio.pause();

        this.cursor = cursor;
        cursor.style.display = 'inline-block';
    },
    write : function (cursor, word, callback) {
        this.queue = this.queue.concat(function(){
            this.switchCursor(cursor);
        }.bind(this),word.split(''), callback);

        if (!this.isWriting) {
            this.start();
        }
        return this;
    },
    pushLetter : function (letter) {
        this.cursor.parentNode.insertBefore(this.createElement(letter), this.cursor);
    }

};