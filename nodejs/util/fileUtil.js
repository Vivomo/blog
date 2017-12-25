const fs = require('fs');
const path = require('path')
const num1 = Buffer.from('你能猜到密码吗');
const len = num1.length;

/**
 * 加密
 * @param data
 */
function simpleLock(data) {
    return data.map((item, index) => {
        return item ^ num1[index % len];
    });
}

/**
 * 解锁
 * @param data
 */
function simpleUnLock(data) {
    return data.map((item, index) => {
        return item ^ num1[index % len];
    });
}


/**
 * 获取一个路径下的所有文件(如果没有权限则抛异常)
 * @param root 路径
 * @return []
 */
function getFilesByPath(root){
    let result = [];
    let files = fs.readdirSync(root);
    files.forEach((file) => {
        let filePath = path.join(root, file);
        let stat = fs.lstatSync(filePath);
        if (stat.isDirectory()) {
            result = result.concat(getFilesByPath(filePath));
        } else {
            result.push(filePath);
        }
    });
    return result;
}

Object.assign(exports, {
    simpleLock,
    simpleUnLock,
    getFilesByPath
});
