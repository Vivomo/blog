function logArgs(...args) {
    console.log(args)
}

function test(...args) {
    logArgs(args)
}

test(1, 2)