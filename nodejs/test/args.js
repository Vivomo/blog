function logArgs(...args) {
    console.log(args)
    console.log(args.constructor)
}

function test(...args) {
    logArgs(args)
}

test(1, 2)
let a = {'0':1, '1':2, length: 2}
let b = [1, 2, 3];
console.log(...a) // error
console.log(...b)