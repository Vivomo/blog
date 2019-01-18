const body = document.body;

const supportClassList = !!body.classList;

export const getDomData = body.dataset ? (dom, dataName) => dom.dataset[dataName] : (dom, dataName) => dom.getAttribute('data-' + dataName);

export const  getMainEvent = (arg) => arg.clientX === undefined ? arg.touches[0] : arg;

export const getEventOffset = (e, elem) => {
    if (e.touches) {
        let {clientX, clientY} = e.touches[0];
        let {left, top} = elem.getBoundingClientRect();
        return {
            offsetX: clientX - left,
            offsetY: clientY - top
        }
    } else {
        return {
            offsetX: e.offsetX,
            offsetY: e.offsetY
        }
    }
};

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


