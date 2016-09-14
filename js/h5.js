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
        callback : null,
        audio : true,
        audioId : 'music-print'
    }, cfg);

    if (this.cfg.audio) {
        this.audio = document.getElementById(this.cfg.audioId);
    }
}

Printer.prototype = {
    constructor : Printer,
    write : function (cursor, word, callback) {
        cursor.style.display = 'inline-block';
        // music.pause();
        this.audio && this.audio.play();
        var i = 0;
        var interval = setInterval(function () {
            if (i >= word.length) {
                cursor.style.display = 'none';
                this.audio && this.audio.pause();
                // music.play();
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

    var hasStart = false;

    function start() {
        if (hasStart) {
            return
        }
        hasStart = true;

        $('#loading-wrap').remove();

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
                                                listenCallback();
                                            }, 1000);
                                        });
                                    })
                                });
                            });
                        });
                    }

                    function listenCallback() {
                        var shakeThreshold = 1000; // 定义一个摇动的阈值
                        var lastUpdate = 0; // 记录上一次摇动的时间
                        var x, y, z, lastX, lastY, lastZ; // 定义x、y、z记录三个轴的数据以及上一次触发的数据

                        // 监听传感器运动事件
                        if (window.DeviceMotionEvent) {
                            window.addEventListener('devicemotion', deviceMotionHandler, false);
                        } else {
                            // alert('本设备不支持devicemotion事件');
                            // $('#shake-hand').one('click', shakeCallback);
                        }
                        $('#shake-hand').one('click', shakeCallback);

                        // 运动传感器处理
                        function deviceMotionHandler(eventData) {
                            var acceleration = eventData.accelerationIncludingGravity; // 获取含重力的加速度
                            var curTime = new Date().getTime();

                            // 100毫秒进行一次位置判断
                            if ((curTime - lastUpdate) > 100) {

                                var diffTime = curTime - lastUpdate;
                                lastUpdate = curTime;

                                x = acceleration.x;
                                y = acceleration.y;
                                z = acceleration.z;

                                var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
                                // 前后x, y, z间的差值的绝对值和时间比率超过了预设的阈值，则判断设备进行了摇晃操作
                                if (speed > shakeThreshold) {
                                    shakeCallback();
                                }

                                lastX = x;
                                lastY = y;
                                lastZ = z;
                            }
                        }
                    }

                    function shakeCallback() {
                        $('#shadow').show();
                        $('#dialog').show().find('.num').text(~~(Math.random() * 27) + 70);

                        try {
                            window.removeEventListener('devicemotion', deviceMotionHandler, false);
                        } catch (e){

                        }

                        setTimeout(function () {
                            $.fn.fullpage.moveSectionDown();
                        }, 3000)
                    }

                        break;
                    case 4:
                        var $cursor = $('.s4 .cursor');
                        p.write($cursor[0], $cursor.eq(0).data('word'), function () {
                            p.write($cursor[1], $cursor.eq(1).data('word'), function () {
                                p.write($cursor[2], $cursor.eq(2).data('word'), function () {
                                    p.write($cursor[3], $cursor.eq(3).data('word'), function () {
                                        $('#apply-wrap').addClass('show');
                                    })
                                })
                            });
                        });
                        break;
                }
                console.log(index)
            }
        });
        var fullpage = $.fn.fullpage;

        window.music = $('#music-bg')[0];

        music.play();
    }


    //lazyload

    (function () {
        var src1 = $('.computer')[0].src;
        var img1 = new Image;
        img1.onload = function () {
            var src2 = /\("(.+?)"\)/.exec($('.s1').css('background-image'))[1];
            var img2 = new Image;
            img2.onload = function () {
                start();
            }
            img2.src = src2;
        };
        img1.src = src1;

        setTimeout(start, 6000);
    })();




    /**
     * 向下移动
     */
    $('.js-down').one('click', function () {
        fullpage.moveSectionDown();
    });

})();