
function Tree(treeData) {
    var childKey = 'children';
    var data = treeData;
    var tree = {};

    tree.childKey = function (key) {
        return arguments.length ? (childKey = key, tree) : childKey;
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
        var nodes = [];
        tree.loop(function (item) {
            if (item[childKey]) {
                nodes.push(item)
            }
        });
        var filter = function (item) {
            return item[childKey] || callback(item);
        };
        for (var i = nodes.length - 1; i >= 0; i--) {
            nodes[i][childKey] = nodes[i][childKey].filter(filter);
            if (nodes[i][childKey].length === 0) {
                delete nodes[i][childKey];
            }
        }
        return data.filter(filter);
    };

    tree.find = function (callback) {
        var arrList = [data];
        var arr, target = null, found = false;
        var findTarget = function (item) {
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
        };
        while ((arr = arrList.shift())) {
            arr.every(findTarget);
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
                children: [
                    {
                        id: 2.1,
                        children: []
                    },
                    {
                        id: 2.2
                    }
                ]
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
                id: 7,
                children: [
                    {
                        id: 11,
                        children: [
                            {
                                id: 12
                            },
                            {
                                id: 15
                            }
                        ]
                    },
                    {
                        id: 13
                    }
                ]
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
//     console.log(item.id);
// });

// var target = Tree(data).find(function (item) {
//     return item.id === 10;
// });
//
// console.log(target);
const log = (obj) => {
    console.log(JSON.stringify(obj, null, 4))
};
var filterResult = Tree(data).filter(function (item) {
    return item.id > 10;
});
// console.log(JSON.stringify(filterResult, null, 4));

var data2 = [
    {id:1, children:[{id:11}, {id:12, children: [{id:124}, {id:122}]}]},
    {id:2, },
    {id:3, children:[{id:31}, {id:32}]},
];
log(Tree(data2).filter(item => item.id % 2));