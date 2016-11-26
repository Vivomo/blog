(function () {
    var language = {
        zh : {
            week : ['日', '一', '二', '三', '四', '五', '六']
        },
        en : {
            week : ['Sun', 'Mon', 'Tue', 'Wen', 'Tur', 'Fri', 'Sat']
        }
    };
    var calendar = window.Calendar = function (option) {
        $.extend(this, option);
        this.init();
    };

    calendar.prototype = {
        constructor : calendar,
        start : 1990,
        end : 2099,
        language : 'zh',
        date : new Date(),
        lv : 4,
        selector : '.calendar-wrap',
        prev : function () {

        },
        next : function () {

        },
        initElem : function(){
            this.$elem = $(this.selector);
        },
        initWeek : function(){
            var weekHTML  = language[this.language].week.map(function (item, index) {
                return '<li class="w'+index+'">'+item+'</li>'
            }).join('');
            this.$elem.find('.calendar-week').html(weekHTML);
        },
        initDate : function(){
            var date = this.date,
                year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate(),
                week = date.getDay(),
                yearOfPrevMonth = month == 0 ? year - 1 : year,
                yearOfNextMonth = month == 11 ? year + 1 : year,
                prevMonth = (month + 11) % 12;

            var weekOFMonth1st = calendar.getWeekOFMonth1st(day, week);
            var totalDay = calendar.getTotalDayOFMonth(year, month);
            var prevMonthLastDay = calendar.getTotalDayOFMonth(yearOfPrevMonth, prevMonth);

            var html = '', w = 0, i;
            for (i = 0; i < weekOFMonth1st; i++) {
                html += calendar.createDateHtml({
                            className : 'prev',
                            w : i,
                            year : yearOfPrevMonth,
                            month : (month + 11) % 12,
                            date : prevMonthLastDay - weekOFMonth1st + i
                        });
                w++;
            }
            for (i = 1; i <= totalDay; i++) {
                html += calendar.createDateHtml({
                    w : w++ % 7,
                    year : year,
                    month : month,
                    date : i
                });
            }

            var patchDay = 6 - w % 7 + 1;
            for (i = 1; i <= patchDay; i++) {
                html += calendar.createDateHtml({
                    className : 'next',
                    w : w++ % 7,
                    year : yearOfNextMonth,
                    month : (month + 1) % 12,
                    date : i
                });
            }

            this.$elem.find('.calendar-date').html(html);
            this.createCurrentDateStyle(year, month, day);

        },
        createCurrentDateStyle : function (year, month, day) {
            var style = '.date-'+year+'-'+month+'-'+day + '{' + 'background:rgba(43, 170, 177, 0.6)}';
            $('head').append('<style id="currentDay-style">'+style+'</style>');
        },
        init : function () {
            this.initElem();
            this.initWeek();
            this.initDate();
        }
    };
    calendar.getWeekOFMonth1st = function(day, week) {
        return Math.abs(day % 7 - week) + 1;
    };
    calendar.getTotalDayOFMonth = function(year, month) {
        switch (month+1) {
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            case 2:
                if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0) ) {
                    return 29;
                } else {
                    return 28;
                }
            default :
                return 31;
        }
    };
    calendar.createDateHtml = function (option) {
        var className = (option.className || '') + ' w' + option.w +
            ' date-'+option.year+'-'+option.month+'-'+option.date;
        return '<li class="'+className+'"><div class="date">'+option.date+'</div></li>'
    };

    calendar.currentDate = (function(){
        var now = new Date();
        var millisecondsOfDay = 86400000;
        return {
            year : now.getFullYear(),
            month : now.getMonth() + 1,
            date : now.getDate(),
            time : now.getTime(),
            equals : function(time) {
                var date;
                if (typeof time == 'string' || typeof time == 'number') {
                    date = new Date(time)
                } else if(typeof time == 'object' && time.constructor == 'Date') {
                    date = time;
                } else {
                    return false;
                }
                return ~~ (now.getTime() / millisecondsOfDay) == ~~ (date.getTime() / millisecondsOfDay);
            }
        }
    })();


    new calendar({

    });
})();
