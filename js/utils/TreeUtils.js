
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
        var _tree = {};
        Object.keys(data).forEach(function (key) {
            if (!filter.includes(key)) {
                _tree[key] = data[key];
            }
        });
        if (data[childKey]) {
            _tree[childKey] = [];
            data[childKey].forEach(function (item) {
                _tree[childKey].push(tree.clone(item));
            });
        }
        return _tree;
    };

    tree.loop = function (callback, loopData = data) {
        loopData.every(function (item) {
            var result = callback(item);
            if (result === false) {
                return false;
            } else {
                if (item[childKey]) {
                    tree.loop(callback, item[childKey])
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
            },
            {
                id: 7
            }
        ]
    }
];
console.log(JSON.stringify(data, null, 4));

var result = Tree(data).map(function (item) {
    return {
        id: item.id * 10
    }
});
console.log(JSON.stringify(result, null, 4));