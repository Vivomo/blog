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
