class A {
    f() {
        console.log('A');
    }
}

// error
class B {
    f = () => {
        console.log('B');
    }
}

let a = new A;
let b = new B;

console.log('')