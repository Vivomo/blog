const body = document.body;

const supportClassList = !!body.classList;

export const getDomData = body.dataset ? (dom, dataName) => dom.dataset[dataName] : (dom, dataName) => dom.getAttribute('data-' + dataName);

export const  getMainEvent = (arg) => arg.clientX === undefined ? arg.touches[0] : arg;

export const  removeClass = supportClassList ? (dom, className) => {
    dom.classList.remove(className);
    return dom;
} : (dom, className) => {
    let classList = dom.className.split(' ');
    let index = classList.indexOf(className);
    if (index !== -1) {
        classList[index] = '';
        dom.className = classList.join(' ');
    }
    return dom;
};

export const  addClass = supportClassList ? (dom, className) => {
    dom.classList.add(className);
    return dom;
} : (dom, className) => {
    if (!hasClass(dom, className)) {
        dom.className += ' ' + className;
    }
    return dom;
};

export const  hasClass = supportClassList ?
    (dom, className) => dom.classList.contains(className) : (dom, className) => dom.className.split(' ').includes(className);

export const toggleClass = (dom, className) => hasClass(dom, className) ? removeClass(dom, className) : addClass(dom, className);

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

CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {
    if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
        return;
    }

    let ctx = this;
    let canvas = ctx.canvas;

    if (typeof maxWidth == 'undefined') {
        maxWidth = canvas.width || 300;
    }
    if (typeof lineHeight == 'undefined') {
        let matchResult = ctx.font.match(/\d+/);
        lineHeight = matchResult ? matchResult[0] * 1.5 : 21;
    }

    let textArr = text.split('');
    let line = '';

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


export const CMD_TYPE = {
    move: 'move',
    once: 'once',
    click: 'click'
};
