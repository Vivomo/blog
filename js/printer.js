
function Printer(cfg) {

    if (this.constructor != Printer) {
        return new Printer(cfg)
    }

    Object.assign(this, cfg);

    this.queue = [];
    this.parent = this.cursor.parentNode;

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
        this.cursor.style.display = 'inline-block';
        this.isWriting = true;
        this.audio && this.audio.play();
        this.interval = setInterval(function () {
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
                this.end();
            }

        }.bind(this), this.pauseTime)
    },
    end : function () {
        clearInterval(this.interval);
        this.cursor.style.display = 'none';
        this.isWriting = false;
        this.audio && this.audio.pause();
    },
    switchCursor : function (cursor) {
        this.cursor.style.display = 'none';
        this.cursor = cursor;
        this.parent = cursor.parentNode;
        this.cursor.style.display = 'inline-block';
        return this;
    },
    write : function (cursor, word, callback) {
        var queue = [];
        if (typeof cursor == 'object') {
            queue = queue.concat(function () {
                this.switchCursor(cursor);
            }, word.split(''));
        } else {
            queue = queue.concat(cursor.split(''));
            callback = word;
        }
        callback && queue.push(callback);
        this.queue = this.queue.concat(queue);

        if (!this.isWriting) {
            this.start();
        }
        return this;
    },
    pushLetter : function (letter) {
        this.parent.insertBefore(this.createElement(letter), this.cursor);
    }
};


// test

var s2 = 'concat 方法并不修改调用它的对象(this 指向的对象) 和参数中的各个数组本身的值,而是将他们的每个元素拷贝一份放在组合成的新数组中.原数组中的元素有两种被拷贝的方式:';
var s1='concat 方法将创建一个新的数组，然后将调用它的对象(this 指向的对象)中的元素以及所有参数中的数组类型的参数中的元素以及非数组类型的参数本身按照顺序放入这个新数组,并返回该数组';

var p = new Printer({
    cursor : document.querySelector('.cursor')
});

p.write(s1).write(s2);

