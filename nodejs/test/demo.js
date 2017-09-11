// var arr = [1, 2, 3, 4, 5];
// arr.forEach(function (item) {
//     if (item === 3) {
//         return false;
//     }
//     console.log(item);
// });


var f = function () {
    console.log(this.name, arguments);
};

var a = {
    name: 'a'
};

f.bind(a);


