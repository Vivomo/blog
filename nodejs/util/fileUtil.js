const num1 = Buffer.from('你能猜到密码吗');
const len = num1.length;

function simpleLock(data) {
    return data.map((item, index) => {
        return item ^ num1[index % len];
    });
}

function simpleUnLock(data) {
    return data.map((item, index) => {
        return item ^ num1[index % len];
    });
}


Object.assign(exports, {
    simpleLock,
    simpleUnLock
});
