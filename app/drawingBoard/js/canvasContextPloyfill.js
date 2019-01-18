let canvasRenderingContext2DPrototype = CanvasRenderingContext2D.prototype;
if (!canvasRenderingContext2DPrototype.ellipse) {
    canvasRenderingContext2DPrototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
        this.save();
        this.translate(x, y);
        this.rotate(rotation);
        this.scale(radiusX, radiusY);
        this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
        this.restore();
    };
}

/**
 * 拓展方法 canvas 绘制支持文字换行
 * @param text
 * @param x
 * @param y
 * @param maxWidth
 * @param lineHeight
 */
canvasRenderingContext2DPrototype.wrapText = function (text, x, y, maxWidth, lineHeight) {
    if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
        return;
    }

    let ctx = this;
    let canvas = ctx.canvas;

    if (typeof maxWidth == 'undefined') {
        maxWidth = canvas.width || 300;
    }
    let fontSizeMatchResult = ctx.font.match(/\d+/);
    let fontSize = fontSizeMatchResult ? fontSizeMatchResult[0] : 14;
    if (typeof lineHeight == 'undefined') {
        lineHeight = fontSize * 1.5;
    }

    let textArr = text.split('');
    let line = '';

    y += ~~((lineHeight - fontSize) / 2);

    for (let i = 0; i < textArr.length; i++) {
        if (textArr[i] === '\n') {
            ctx.fillText(line, x, y);
            line = '';
            y += lineHeight;
            continue;
        }
        let testLine = line + textArr[i];
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = textArr[i];
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
};
