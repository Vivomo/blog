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

    var todayStyleTemplate = '<style id="currentDay-style">.className{background:rgba(43, 170, 177, 0.6)}</style>'

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
        viewModel : 3, // 年代, 年, 月
        selector : '.calendar-wrap',

        setViewModel : function (num) {
            if (num > 0 && num < 5) {
                this.viewModel = num;
                this.$elem.find('.lv'+num).show().siblings().hide();
                this.refresh();
            }
        },
        setDecadeYear : function (year, noRefresh) {
            this.decadeStart = year - year % 10;
            if (noRefresh !== false) {
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
                    this.setDecadeYear(this.decadeStart - 10);
                    break;
                case 2:
                    this.setYear(this.year - 1);
                    break;
                case 3:
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
                    this.setDecadeYear(this.decadeStart + 10);
                    break;
                case 2:
                    this.setYear(this.year + 1);
                    break;
                case 3:
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
                    title = this.decadeStart + '-' + (this.decadeStart + 9);
                    this.viewDecadeYear();
                    break;
                case 2:
                    title = this.year;
                    this.viewYear();
                    break;
                case 3:
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
                if (calendar.viewModel == 2) {
                    calendar.setDecadeYear(calendar.year);
                }
                calendar.setViewModel(calendar.viewModel - 1);
            });

            $elem.find('.calendar-year').on('click', 'li', function () {
                calendar.setYear($(this).data('year'), false);
                calendar.setViewModel(2);
            });

        },
        initMonth : function () {
            monthHTML = language[this.language].month.map(function (month) {
                return '<li>'+month+'</li>'
            }).join('');

            var calendar = this;
            calendar.$elem.find('.calendar-month').on('click', 'li', function () {
                calendar.setMonth($(this).index());
                calendar.setViewModel(3);
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
        viewDecadeYear : function () {
            var html = this.createHTMLOfDecadeYear(this.decadeStart);
            this.$elem.find('.calendar-year').html(html);
        },
        initDate : function(){
            var date = this.date,
                year = this.year = date.getFullYear(),
                month = this.month = date.getMonth(),
                day = this.day = date.getDate();

            this.decadeStart = year - year % 10;
            this.refresh();
            this.createCurrentDateStyle(year, month, day);

        },
        createHTMLOfDecadeYear : function (decadeStart) {
            var html = '<li class="prev" data-year="'+(decadeStart-1)+'">'+(decadeStart-1)+'</li>';
            for (var i = decadeStart; i < decadeStart + 10; i++) {
                html += '<li data-year="'+i+'">'+i+'</li>';
            }
            return html + '<li class="next" data-year="'+(decadeStart+10)+'">'+(decadeStart+10)+'</li>';

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

                var weekOFMonth1st = getWeek(year, month + 1, 1);
                var totalDay = getTotalDayOFMonth(year, month);
                var prevMonthLastDay = getTotalDayOFMonth(yearOfPrevMonth, prevMonth);

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
            $('head').append(todayStyleTemplate.replace('className', '.date-'+year+'-'+month+'-'+day));
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

     function getTotalDayOFMonth(year, month) {
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
    }
    /**
     * 蔡勒公式中1月用13表示，2月用14表示, 同时年-1
     * (不直接new Date.getDay 为了性能)
     * https://zh.wikipedia.org/wiki/%E8%94%A1%E5%8B%92%E5%85%AC%E5%BC%8F
     * @param year
     * @param month
     * @param day
     * @returns {number}
     */
    function getWeek(year, month, day) {
        if (month < 3) {
            month += 12;
            year -= 1;
        }
        var century = ~~ (year / 100);
        year = year % 100;
        return Math.abs( (year + ~~(year/4) + ~~(century/4) - 2 * century + ~~(26 * (month + 1) / 10) + day - 1)
            % 7);
    }

})();
