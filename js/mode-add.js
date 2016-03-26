var imgData = ["http://img.saihuitong.com/66/albumImg/681/153831db51a.jpg-w240", "http://img.saihuitong.com/66/albumImg/681/153831dcae6.jpg-w240", "http://img.saihuitong.com/66/albumImg/681/153831da5d9.jpg-w240", "http://img.saihuitong.com/66/albumImg/681/153831dc4a9.jpg-w240", "http://img.saihuitong.com/66/albumImg/681/153831d8edc.jpg-w240", "http://img.saihuitong.com/66/albumImg/681/153831d85a9.jpg-w240"];
var Mode = {
    $wrap : null,
    html: {},
    data : {
        flashImg : {
            html : '',
            registerEvent : function ($mode) {
                var $iframe = $mode.find('.video-iframe');
                $mode.find('.set-video-url').blur(function () {
                    $iframe.prop('src', this.value);
                });
            }
        },
        imgSix : {
            html : '',
            registerEvent : function ($mode) {
                $mode.find('.add-img').one('click', function () {
                    var listHTML = imgData.map(function (item) {
                        return '<li><img src="'+item+'"></li>'
                    }).join('');

                    $mode.find('.j-list').append(listHTML);
                });
            }
        }
    },
    renderHTML: function (type) {
        var mode = Mode.data[type];
        var $mode = $(mode.html);
        this.$wrap.append($mode);
        mode.registerEvent($mode)
    },
    init : function () {
        $('.html-mode').each(function () {
            Mode.data[$(this).data('type')].html = this.value;
        });
        this.$wrap = $('#main');
    }
};

Mode.init();

$('#modes-thumb').on('click', 'li', function () {
    Mode.renderHTML($(this).data('type'));
});

$('#main').on('click', '.j-del', function () {
    $(this).parent().remove();
});