let ProgressBar = require('progress');

let bar = new ProgressBar(':bar', {
    total: 100,
    width: 20,
    complete: '=',
    incomplete: ' ',
});
let i = 0;
let timer = setInterval(function () {
    bar.tick(i++);
    if (bar.complete) {
        console.log('\ncomplete\n');
        clearInterval(timer);
    }
}, 100);