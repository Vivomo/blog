const delay = (t, v) => {
    return new Promise((resolve) => {
        setTimeout(resolve.bind(null, v), t)
    })
};

// delay(1000)
//     .then(() => delay(2000, console.log(2)))
//     .then(() => delay(2000, console.log(3)))


Promise.prototype.delay = function(t) {
    return this.then(function(v) {
        return delay(t, v);
    });
}

delay(1000).then(() => {
    console.log(1)
}).delay(1000).then(() => {
    console.log(2)
}).delay(1000).then(() => {
    console.log(3)
})