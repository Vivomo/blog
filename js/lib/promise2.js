class Promise2 {
    constructor(cb) {
        this._cbList = [];
        cb(this.resolve, this.reject);
    }

    resolve(args) {
        setTimeout(() => {
            let cb = this.getCB(0);
            cb && cb(args);
        })
    }

    reject(args) {
        setTimeout(() => {
            let cb = this.getCB(1);
            cb && cb(args);
        })
    }

    getCB(index) {
        let fn = this._cbList.shift();
        return fn ? fn[index] : null;
    }


    then(resolve, reject) {
        this._cbList.push([resolve, reject]);
    }
}

// new Promise2((resolve, reject) => {
//     setTimeout(() => {
//         resolve(1);
//     })
// }).then(() => {
//
// });


new Promise((resolve, reject) => {
    resolve(1)
}).then((result) => {

});