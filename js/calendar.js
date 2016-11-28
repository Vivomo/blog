(function () {
    var language = {
        zh : {
            week : ['日', '一', '二', '三', '四', '五', '六']
        },
        en : {
            week : ['Sun', 'Mon', 'Tue', 'Wen', 'Tur', 'Fri', 'Sat']
        }
    };
    var Calendar = window.Calendar = function (option) {
        $.extend(this, option);
        this.init();
    };

    Calendar.prototype = {
        constructor : Calendar,
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
                year = this.year = date.getFullYear(),
                month = this.month = date.getMonth(),
                day = this.day = date.getDate(),
                html = this.createHTMLOfMonth(year, month);

            this.$elem.find('.calendar-date').html(html);
            this.createCurrentDateStyle(year, month, day);

        },
        createHTMLOfMonth : function (year, month) {
            var key = year+'-'+month;
            if (this.cache[key]) {
                return this.cache[key]
            } else {
                var yearOfPrevMonth = month == 0 ? year - 1 : year,
                    yearOfNextMonth = month == 11 ? year + 1 : year,
                    prevMonth = (month + 11) % 12;

                var weekOFMonth1st = this.getWeek(year, month + 1, 1);
                var totalDay = this.getTotalDayOFMonth(year, month);
                var prevMonthLastDay = this.getTotalDayOFMonth(yearOfPrevMonth, prevMonth);

                var html = '', w = 0, i;
                for (i = 0; i < weekOFMonth1st; i++) {
                    html += this.createDateHtml({
                        className : 'prev',
                        w : i,
                        year : yearOfPrevMonth,
                        month : (month + 11) % 12,
                        date : prevMonthLastDay - weekOFMonth1st + i
                    });
                    w++;
                }
                for (i = 1; i <= totalDay; i++) {
                    html += this.createDateHtml({
                        w : w++ % 7,
                        year : year,
                        month : month,
                        date : i
                    });
                }

                var patchDay = 6 - w % 7 + 1 + (w < 35 ? 7 : 0);
                for (i = 1; i <= patchDay; i++) {
                    html += this.createDateHtml({
                        className : 'next',
                        w : w++ % 7,
                        year : yearOfNextMonth,
                        month : (month + 1) % 12,
                        date : i
                    });
                }
                return (this.cache[key] = html);
            }
        },
        createCurrentDateStyle : function (year, month, day) {
            var style = '.date-'+year+'-'+month+'-'+day + '{' + 'background:rgba(43, 170, 177, 0.6)}';
            $('head').append('<style id="currentDay-style">'+style+'</style>');
        },
        /**
         * 蔡勒公式
         * https://zh.wikipedia.org/wiki/%E8%94%A1%E5%8B%92%E5%85%AC%E5%BC%8F
         * @param year
         * @param month
         * @param day
         * @returns {number}
         */
        getWeek : function(year, month, day) {
            var century = ~~ (year / 100);
            year = year % 100;
            return (year + ~~(year/4) + ~~(century/4) - 2 * century + ~~(26 * (month + 1) / 10) + day - 1) % 7;
        },
        getTotalDayOFMonth : function(year, month) {
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
        },
        createDateHtml : function (option) {
            var className = (option.className || '') + ' w' + option.w +
                ' date-'+option.year+'-'+option.month+'-'+option.date;
            return '<li class="'+className+'"><div class="date">'+option.date+'</div></li>'
        },
        init : function () {
            this.cache = {};
            this.initElem();
            this.initWeek();
            this.initDate();
        }
    };


    Calendar.currentDate = (function(){
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


    new Calendar({

    });
})();
