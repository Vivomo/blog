const delay = (t, v) => {
    return new Promise((resolve) => {
        setTimeout(resolve.bind(null, v), t)
    })
};

delay(1000, console.log(1))
    .then(() => delay(2000, console.log(2)))
    .then(() => delay(2000, console.log(3)))
