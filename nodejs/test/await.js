let sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};

let start = async function () {
    console.log('start');
    await sleep(3000);
    console.log('end');
    return 1;
};

let r = start();
// console.log(r);