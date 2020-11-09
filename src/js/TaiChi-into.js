let App = (() => {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let containerHeight = h;
    let containerWidth = Math.min(w, ~~(h * 0.618));
    let ballSize = ~~(w / 12);
    let TaiChiSize = containerWidth * 0.3;

    let TaiChi = document.querySelector('.TaiChi');
    let container = document.querySelector('#container');
    container.style.width = containerWidth + 'px';
    TaiChi.style.width = TaiChi.style.height = TaiChiSize + 'px';

    return {

    }
})();