let request = function (time, arg) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(arg);
        }, time);
    })
};

let test = async () => {
    console.time('a');
    let [a, b] = await Promise.all([
        request(1000, 1),
        request(2000, 2)
    ]);
    console.timeEnd('a');
    console.log(a, b);
    return a + b;
};

test().then((data) => {
    console.log(data);
});
