var transform = 'transform' in document.body.style ? 'transform' : 'webKitTransform';

$.fn.duang = function (cfg) {

    cfg = cfg || {};

    return this.each(function () {
        var h1 = $(this).height(),
            $content = $(this).find(cfg.content || '.duang-content'),
            h2 = $content.height(),

            touchStartX = 0,
            touchStartY = 0,
            touchMoveX = 0,
            touchMoveY = 0;

        $content.data({
            min : (h1 - h2 < 0 ) ? h1 - h2 : 0,
            max : cfg.max || 0,
            tolerance : cfg.tolerance || 200,
            k : cfg.k || 0.3, //系数
            translateX : 0,
            translateY : 0
        }).on('touchstart touchmove touchend', function (event) {

            var $this = $(this);
            if ( $this.data('animating')) {
                return false;
            }
            var touch = event.touches[0];
            switch(event.type) {
                case 'touchstart':
                    var translate = getTranslate(this);

                    touchStartX = touch.pageX;
                    touchStartY = touch.pageY;
                    $this.data({
                        translateX : translate.x,
                        translateY : translate.y
                    });

                    break;
                case 'touchmove':
                    event.preventDefault();

                    touchMoveX = touch.pageX;
                    touchMoveY = touch.pageY;
                    touchMove(this, touchMoveX - touchStartX, touchMoveY - touchStartY);
                    break;

                case 'touchend':
                    restore(this);
                    break;
            }
        });

    });


};
/********************************************************************************/

function restore(elem) {
    var translate = getTranslate(elem),
        $elem = $(elem),
        data = $elem.data(),
        min = data.min,
        max = data.max,
        tolerance = data.tolerance,
        style = {},
        time;

    if (translate.y < min) {
        time = (min - translate.y) / tolerance * 0.5;
        style.transition = 'transform '+time+'s cubic-bezier(0.39, 1.14, 0.77, 1.19)';
        style[transform] = 'translate(0, '+min+'px)';
        $elem.css(style);

    } else if (translate.y > max) {
        time = (translate.y - max) / tolerance * 0.5;
        style.transition = 'transform '+time+'s cubic-bezier(0.39, 1.14, 0.77, 1.19)';
        style[transform] = 'translate(0, '+max+'px)';
        $elem.css(style);
    } else {
        return;
    }

    $elem.data('animating', true);

    setTimeout(function () {
        $elem.data('animating', false).css('transition', 'transform 0s');
    }, ~~(1000 * time));

}

function touchMove(elem, x, y) {

    var $elem = $(elem),
        data = $elem.data(),
        min = data.min,
        max = data.max,
        k = data.k,
        tolerance = data.tolerance;

    //x += translateX;
    y += data.translateY;

    if (y < min) {
        y = min + (y - min) * k;
        y = (y < min - tolerance) ? min - tolerance : y;
    } else if ( y > max) {
        y = max + (y - max) * k;
        y = ( y > max + tolerance) ? max + tolerance : y;
    }

    $elem.css(transform, 'translate(0, '+y+'px)');
}

function getTranslate(elem) {
    var translate = {
        x : 0,
        y : 0
    };
    var matrix = document.defaultView.getComputedStyle(elem, null)['transform'];

    if (matrix != 'none') {
        var num = matrix.match(/\-?\d+\.?\d*/g).map(getInt);

        if (num.length == 17) {
            // matrix3d  so 16+1
            translate.x  = num[15];
            translate.y = num[14];

        } else {
            translate.x = num[4];
            translate.y = num[5];
        }
    }

    return translate;
}

/**
 * Array.map 直接用parseInt 会报错
 * @param num
 * @returns {Number}
 */
function getInt(num) {
    return parseInt(num);
}
