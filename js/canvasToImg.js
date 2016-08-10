/**
 * Created by ui on 2016/8/5.
 */

(function () {
    var colors = $id('colors');
    var colorWrap = $id('canvas-wrap');
    var twoPi = Math.PI * 2;
    var halfPi = Math.PI / 2;
    var base64Text = $id('base64');

    var config = {
        circleCount: 120,
        radius: 22,
        lineWidth: 12,
        foreground: '#fff',
        background: '#648'
    };

    $id('draw').addEventListener('click', function () {
        var colorArr = getColors();
        colorWrap.innerHTML = colorArr.map(function (col) {
            return '<canvas data-background="'+col+'"></canvas>';
        }).join('');

        var canvasList = Array.prototype.slice.call(document.querySelectorAll('canvas'));
        base64Text.value =canvasList.map(function (canvas) {
            var cxt = canvas.getContext('2d');
            canvas.width =  config.radius * 2 + config.lineWidth;
            canvas.height = canvas.width * config.circleCount;

            var cfg = extend({}, config);
            cfg.background = canvas.dataset.background;
            var ring = new Ring(cxt, cfg);
            var x = canvas.width / 2;
            var circleCount = config.circleCount;
            for (var i = 0; i < circleCount; i++) {
                ring.draw(x, x * i * 2 + x, -halfPi, twoPi * ((i + 1) / config.circleCount) - halfPi, i == circleCount - 1);
            }
            return canvas.toDataURL('image/png');
        }).join('###')
    }, false);

    function $id(id) {
        return document.getElementById(id);
    }
    
    function getColors() {
        return colors.value.split(',').map(function (item) {
            return item.trim();
        })
    }

    function extend(obj1, obj2) {
        for (var k in obj2) {
            obj2[k] !== undefined && (obj1[k] = obj2[k])
        }
        return obj1;
    }
    function Ring(cxt, config) {
        this.cxt = cxt;
        extend(this, config);
        cxt.lineWidth = config.lineWidth;
    }

    Ring.prototype.draw = function (x, y, start, end, noBackground) {
        var cxt = this.cxt;
        if (!noBackground) {
            cxt.beginPath();
            cxt.strokeStyle = this.background;
            cxt.arc(x, y, this.radius, end, start);
            cxt.stroke();
            cxt.closePath();
        }

        cxt.beginPath();
        cxt.strokeStyle = this.foreground;
        cxt.arc(x, y, this.radius, start, end, false);
        cxt.stroke();
        cxt.closePath();

    }

})();








