(function () {
    var language = {
        zh : {
            week : ['日', '一', '二', '三', '四', '五', '六'],
            month : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        en : {
            week : ['Sun', 'Mon', 'Tue', 'Wen', 'Tur', 'Fri', 'Sat'],
            month : ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
        }
    };

    var monthHTML = '';
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

        setViewModel : function (num) {
            if (num > 0 && num < 5) {
                this.viewModel = num;
                this.$elem.find('.lv'+num).show().siblings().hide();
                this.refresh();
            }
        },
        setYear : function (year, noRefresh) {
            this.year = year;
            if (noRefresh !== false) {
                this.refresh();
            }
        },
        setMonth : function (month) {
            this.month = month;
            this.refresh();
        },
        prev : function () {
            switch(this.viewModel) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    this.setYear(this.year - 1);
                    break;
                case 4:
                    if (this.month === 0) {
                        this.setYear(this.year - 1, false);
                    }
                    this.setMonth((this.month + 11) % 12);
                    this.viewMonth();
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
                    this.setYear(this.year + 1);
                    break;
                case 4:
                    if (this.month === 11) {
                        this.setYear(this.year + 1, false);
                    }
                    this.setMonth( (this.month + 1) % 12);
                    break;
            }
        },

        refresh : function () {
            var title = '';
            switch(this.viewModel) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    title = this.year;
                    this.viewYear();
                    break;
                case 4:
                    title = this.year + '/' + (this.month + 1);
                    this.viewMonth();
                    break;
            }
            this.$title.html(title);

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

            this.$title.click(function () {
                calendar.setViewModel(calendar.viewModel - 1);
            });


        },
        initMonth : function () {
            monthHTML = language[this.language].month.map(function (month) {
                return '<li>'+month+'</li>'
            }).join('');

            var calendar = this;
            calendar.$elem.find('.calendar-month').on('click', 'li', function () {
                calendar.setMonth($(this).index());
                calendar.setViewModel(4);
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
        viewYear : function () {
            var html = this.createHTMLOfYear();
            this.$elem.find('.calendar-month').html(html);
        },
        initDate : function(){
            var date = this.date,
                year = this.year = date.getFullYear(),
                month = this.month = date.getMonth(),
                day = this.day = date.getDate();

            this.viewMonth();
            this.createCurrentDateStyle(year, month, day);

        },
        createHTMLOfYear : function () {
            if (!monthHTML) {
                this.initMonth();
            }
            return monthHTML;
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
         * 蔡勒公式中1月用13表示，2月用14表示, 同时年-1
         * (不直接new Date.getDay 为了性能)
         * https://zh.wikipedia.org/wiki/%E8%94%A1%E5%8B%92%E5%85%AC%E5%BC%8F
         * @param year
         * @param month
         * @param day
         * @returns {number}
         */
        getWeek : function(year, month, day) {
            if (month < 3) {
                month += 12;
                year -= 1;
            }
            var century = ~~ (year / 100);
            year = year % 100;
            return Math.abs( (year + ~~(year/4) + ~~(century/4) - 2 * century + ~~(26 * (month + 1) / 10) + day - 1)
                % 7);
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
