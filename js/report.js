function extend(o1, o2) {
    for (var k in o2) {
        o1[k] = o2[k]
    }
    return o1;
}
function Printer(cfg) {

    if (this.constructor != Printer) {
        return new Printer(cfg)
    }

    extend(this, cfg);

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
            }.bind(this), word.split(''));
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


var Report = (function () {
    var $page = $('.page'),
        $clubName = $('#club-name'),
        $next = $('#next-page'),
        $footer = $('footer'),
        $start = $('#start'),
        transform = 'transform' in document.body.style ? 'transform' : 'webKitTransform';

    var printer = new Printer({
        pauseTime : 100,
        cursor : document.querySelector('.cursor')
    });

    function animated($elem, callback) {
        $elem.addClass($elem.data('animate'));
        if (callback) {
            $elem.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', callback);
        }
    }

    return {
        initedSections : [],
        start : function () {
            animated($clubName);
            setTimeout(function () {
                animated($start);
            }, 1000);
            $footer.hide();
        },
        newUser : function () {
            animated($('.p2 .purple-circle-wrap'), function () {
                animated($('#red-ball-robot'), function () {
                    var deg = 0,
                        r = 220,
                        userLength = 9,
                        intervalDeg = 360 / userLength;
                    $('.p2 .user-list .item').each(function () {
                        var radian = (deg + Math.random() * 10 - 5) * Math.PI / 180;
                        var x = Math.cos(radian) * (r + Math.random() * 20 - 10);
                        var y = -Math.sin(radian) * (r + Math.random() * 20 - 10);
                        var scale = 0.8 + Math.random() * 0.4;
                        $(this).css(transform, 'translate3d('+x+'px, '+y+'px,0) scale('+scale+')');
                        deg += intervalDeg;
                    });
                });
            });
            var $cursor = $('.p2 .cursor');
            printer.write($cursor[0], '2016年共新增用户', function () {
                $cursor.before('<strong>100</strong>');
            }).write('名');
            $footer.show();
        },
        visitor : function () {
            var $cursor = $('.p3 .cursor');
            printer.write($cursor[0], '2016年共', function () {
                $cursor.before('<strong>100</strong>');
            }).write('名用户访问了俱乐部');
        },
        event : function () {
            var $cursor = $('.p4 .cursor');
            printer.write($cursor[0], '2016年共发布了', function () {
                $cursor.before('<strong>100</strong>');
            }).write('个活动, 其中', function(){
                $cursor.before('<strong>10</strong>');
            }).write('月是活动发布高峰');

            animated($('.p4 .purple-circle-wrap'), function () {
                var deg = 0,
                    r = 220,
                    eventLength = 8,
                    intervalDeg = 360 / eventLength;
                $('.p4 .event-list .item').each(function () {
                    var radian = (deg + Math.random() * 10 - 5) * Math.PI / 180;
                    var x = Math.cos(radian) * (r + Math.random() * 20 - 10);
                    var y = -Math.sin(radian) * (r + Math.random() * 20 - 10);
                    var scale = 0.8 + Math.random() * 0.4;
                    $(this).css(transform, 'translate3d('+x+'px, '+y+'px,0) scale('+scale+')');
                    deg += intervalDeg;
                });
            });
        },
        applier : function () {
            var $cursor = $('.p5 .cursor');
            printer.write($cursor[0], '2016年共有', function () {
                $cursor.before('<strong>1584</strong>');
            }).write('人通过网站报名参加活动');
        },
        money : function () {
            var $cursor = $('.p6 .cursor');
            printer.write($cursor[0], '2016年网站一共成交', function () {
                $cursor.before('<strong>¥19023</strong>');
            }).write('交易额');
        },
        end : function () {
            var $cursor = $('.p7 .cursor');
            printer.write($cursor[0], '2017\n与您携手共创新的辉煌！');
        },
        initSection : function (name) {
            if (this.initedSections.indexOf(name) == -1) {
                this[name] && this[name]();
                this.initedSections.push(name);
            }
        },
        init : function () {
            $('#wrap').fullpage({
                anchors : ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
                afterLoad : function (a, index) {
                    var _$page = $page.eq(index-1);
                    Report.initSection(_$page.data('name'));
                    if (index == $page.length) {
                        $next.hide();
                    } else {
                        $next.show();
                    }
                }
            });


            var fullpage = $.fn.fullpage;

            /**
             * 向下移动
             */
            $next.add($start).click(function () {
                fullpage.moveSectionDown();
            });

        }
    }
})();

Report.init();
