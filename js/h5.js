/**
 * Created by ui on 2016/9/12.
 */


function Printer(cfg) {

    if (this.constructor != Printer) {
        return new Printer(cfg)
    }
    this.cfg = $.extend({
        pauseTime : 200,//ms
        tag : 'span',
        callback : null
    }, cfg);
}

Printer.prototype = {
    constructor : Printer,
    write : function (cursor, word, callback) {
        cursor.style.display = 'inline-block';
        var i = 0;
        var interval = setInterval(function () {
            if (i >= word.length) {
                cursor.style.display = 'none';
                callback && callback();
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
    var p = new Printer;
    var cache = {};
    $('#wrap').fullpage({
        anchors : ['s1', 's2', 's3', 's4', 's5'],
        afterLoad : function (a, index) {
            if (cache[index])
                return;
            else
                cache[index] = true;

            switch (index) {
                case 1:
                    setTimeout(function () {
                        $('.computer').addClass('show');
                        var $cursor = $('.s1 .cursor');
                        p.write($cursor[0], $cursor.eq(0).data('word'), function () {
                            p.write($cursor[1], $cursor.eq(1).data('word'), function () {
                                p.write($cursor[2], $cursor.eq(2).data('word'), function () {
                                    $('.s1 .runner').show();
                                })
                            });
                        });

                    }, 100);
                    break;
                case 2:
                    setTimeout(function () {
                        $('#tl1').addClass('show');
                        setTimeout(function () {
                            var $cursor = $('.s2 .cursor');
                            p.write($cursor[0], $cursor.eq(0).data('word'), function () {
                                p.write($cursor[1], $cursor.eq(1).data('word'), function () {
                                    p.write($cursor[2], $cursor.eq(2).data('word'), function () {
                                        toggleScreen();
                                    })
                                });
                            });
                            $('.s2 .cloud').each(function (index, item) {
                                 setTimeout(function () {
                                     $(item).addClass('show');
                                 }, index * 100)
                            });
                            $('.s2 .bomb').addClass('show');
                        }, 800);

                    }, 100);


                    function toggleScreen() {
                        $('.s2 .screen1').fadeOut(300, function () {
                            $('.s2 .screen2').fadeIn(300, function () {
                                var $cursor = $(this).find('.cursor');
                                p.write($cursor[0], $cursor.data('word'), showFoot);
                            });
                        });
                    }

                    function showFoot() {
                        var $feet = $('.road .foot');
                        var i = 0;
                        var interval = setInterval(function () {
                            $feet.eq(i++).show(300);
                            if (i == $feet.length) {
                                clearInterval(interval);
                                $('.s2 .runner').show();
                            }
                        }, 150);
                    }
                    break;
                case 3:
                    var $cursor = $('.s3 .cursor');
                    p.write($cursor[0], $cursor.eq(0).data('word'), function () {
                        p.write($cursor[1], $cursor.eq(1).data('word'), function () {
                            p.write($cursor[2], $cursor.eq(2).data('word'), function () {
                                $('.s3').addClass('bg1').removeClass('bg2');
                                toggleScreen_3();
                            })
                        });
                    });
                    function toggleScreen_3() {
                        $('.s3 .screen1').fadeOut(300, function () {
                            $('.s3 .screen2').fadeIn(300, function () {
                                var $cursor = $(this).find('.cursor');
                                p.write($cursor[0], $cursor.eq(0).data('word'), function () {
                                    p.write($cursor[1], $cursor.eq(1).data('word'), function () {
                                        $('#arrow').show(300, function () {
                                            $('#time').addClass('show');

                                            setTimeout(function () {
                                                $('#shake-hand').addClass('shake');
                                            }, 1000);
                                        });
                                    })
                                });
                            });
                        });
                    }

                    break;
            }
            console.log(index)
        }
    });
    var fullpage = $.fn.fullpage;

    /**
     * 向下移动
     */
    $('.js-down').one('click', function () {
        fullpage.moveSectionDown();
    });

})();