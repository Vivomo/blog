class A {
    test() {
        console.log(this)
    }
}

let a = new A;
console.log(this, '1');

a.test();
setTimeout(a.test, 0);
setTimeout(logThis, 0);


function logThis() {
    console.log(this);
}