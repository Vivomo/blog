
function Tree(treeData) {
    var childKey = 'children';
    var filter = [];
    var data = treeData;
    var tree = {};

    tree.childKey = function (key) {
        return arguments.length ? (childKey = key, tree) : childKey;
    };

    tree.filterKey = function (keys) {
        return arguments.length ? (filter = keys, tree) : filter;
    };

    /**
     * 浅克隆tree,
     */
    tree.clone = function () {
        return tree.map(function (item) {
            var obj = {};
            Object.keys(item).forEach(function (key) {
                obj[key] = item[key];
            });
            return obj;
        }, data);
    };

    tree.loop = function (callback, loopData = data) {
        return loopData.every(function (item) {
            var result = callback(item);
            if (result === false) {
                return false;
            } else {
                if (item[childKey]) {
                    return tree.loop(callback, item[childKey]);
                }
                return true;
            }
        });
    };

    tree.map = function (callback, loopData = data) {
        return loopData.map(function (item) {
            var result = callback(item);

            if (typeof result === 'object' && result !== null) {
                var children = item[childKey];
                if (children) {
                    result[childKey] = tree.map(callback, children);
                }
            }
            return result;
        });
    };

    tree.filter = function (callback) {
        // TODO
    };

    tree.find = function (callback) {
        var arrList = [data];
        var arr, target = null, found = false;
        while ((arr = arrList.shift())) {
            arr.every(function (item) {
                var result = callback(item);
                if (result) {
                    target = item;
                    found = true;
                    return false;
                }
                if (item[childKey]) {
                    arrList.push(item[childKey])
                }
                return true;
            });
            if (found) {
                break;
            }
        }
        return target;
    };

    return tree;
}

var data = [
    {
        id: 1,
        children: [
            {
                id: 2,
            },
            {
                id: 3
            }
        ]
    },
    {
        id: 4,
        children: [
            {
                id: 6,
                children: [
                    {
                        id: 9,
                    },
                    {
                        id: 10
                    }
                ]
            },
            {
                id: 7
            }
        ]
    }
];
// console.log(JSON.stringify(data, null, 4));
//
// var cloneData = Tree(data).clone();
//
// var result = Tree(cloneData).map(function (item) {
//     return {
//         id: item.id * 10
//     }
// });
// console.log(JSON.stringify(data, null, 4));
// console.log(JSON.stringify(result, null, 4));
// Tree(data).loop(function (item) {
//     console.log(item);
//     return item.id < 5;
// })

var target = Tree(data).find(function (item) {
    return item.id === 10;
});

console.log(target);