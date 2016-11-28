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
        viewModel : 4, // 世纪, 10年, 年, 月
        selector : '.calendar-wrap',
        prev : function () {

            switch(this.viewModel) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    if (this.month === 0) {
                        this.year -= 1;
                    }
                    this.month = (this.month + 11) % 12;
                    this.viewMonth();
                    this.setTitle();
                    break;
            }
        },
        next : function () {
            switch(this.viewModel) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    if (this.month === 11) {
                        this.year += 1;
                    }
                    this.month = (this.month + 1) % 12;
                    this.viewMonth();
                    this.setTitle();
                    break;
            }
        },
        setTitle : function () {
            switch(this.viewModel) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    this.$title.html(this.year + '/' + (this.month + 1));
                    break;
            }
        },
        refresh : function () {

        },
        initElem : function(){
            var $elem = this.$elem = $(this.selector);
            this.$title = $elem.find('.title');
            var calendar = this;
            $elem.find('.prev').click(function () {
                if (!this.disabled)
                    calendar.prev();
            });
            $elem.find('.next').click(function () {
                if (!this.disabled)
                    calendar.next();
            });
        },
        initWeek : function(){
            var weekHTML  = language[this.language].week.map(function (item, index) {
                return '<li class="w'+index+'">'+item+'</li>'
            }).join('');
            this.$elem.find('.calendar-week').html(weekHTML);
        },
        viewMonth : function (year, month) {
            year = year || this.year;
            month = month || this.month;
            var html = this.createHTMLOfMonth(year, month);
            this.$elem.find('.calendar-date').html(html);
        },
        initDate : function(){
            var date = this.date,
                year = this.year = date.getFullYear(),
                month = this.month = date.getMonth(),
                day = this.day = date.getDate();

            this.viewMonth();
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
                var prevPatchDay = weekOFMonth1st || 7;
                for (i = 0; i < prevPatchDay; i++) {
                    html += this.createDateHtml({
                        className : 'prev',
                        w : i,
                        year : yearOfPrevMonth,
                        month : (month + 11) % 12,
                        date : prevMonthLastDay - prevPatchDay + i
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

                var nextPatchDay = 6 - w % 7 + 1 + (w < 35 ? 7 : 0);
                for (i = 1; i <= nextPatchDay; i++) {
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
         * 蔡勒公式 公式有所改动, 最后的-1 改为了+6 避免负数
         * https://zh.wikipedia.org/wiki/%E8%94%A1%E5%8B%92%E5%85%AC%E5%BC%8F
         * @param year
         * @param month
         * @param day
         * @returns {number}
         */
        getWeek : function(year, month, day) {
            var century = ~~ (year / 100);
            year = year % 100;
            return (year + ~~(year/4) + ~~(century/4) - 2 * century + ~~(26 * (month + 1) / 10) + day + 6) % 7;
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
