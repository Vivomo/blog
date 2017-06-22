
var TreeUtils = {
    childrenKey: 'children',
    /**
     * 浅克隆tree,
     *
     * @param tree 需要克隆的树
     * @param cfg {Object} {childrenKey, filter  } 克隆配置, 可以指定childrenKey, filter不需要克隆的属性的数组,
     *          childrenKey 会自动加到filter 当中
     */
    clone: function (tree, cfg) {
        cfg = cfg || {};
        var childrenKey = cfg.childrenKey || TreeUtils.childrenKey;
        var filterKeys = cfg.filter ? cfg.filter.concat(childrenKey) : [childrenKey];

        var _tree = {};
        Object.keys(tree).forEach(function (key) {
            if (!filterKeys.includes(key)) {
                _tree[key] = tree[key];
            }
        });
        if (tree[childrenKey]) {
            _tree[childrenKey] = [];
            tree[childrenKey].forEach(function (item) {
                _tree[childrenKey].push(TreeUtils.clone(item));
            });
        }
        return _tree;
    },

    loop: function (tree, callback) {
        if (callback(tree) === false) {
            return;
        }
        if (tree.children) {
            tree.children.forEach(function (item) {
                loopTree(item, callback);
            })
        }
    }


};

function Tree() {
    var childKey = 'children';
    var filter = [];

    function tree() {

    }

    tree.childKey = function (key) {
        return arguments.length ? (childKey = key, tree) : childKey;
    };

    tree.filterKey = function (keys) {
        return arguments.length ? (filter = keys, tree) : filter;
    };

    tree.clone = function (data) {
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

    tree.loop = function (data, callback) {
        if (callback(data) === false) {
            return;
        }
        if (data[childKey]) {
            data[childKey].forEach(function (item) {
                tree.loop(item, callback);
            })
        }
    };

    return tree;
}