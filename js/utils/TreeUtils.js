
var TreeUtils = {
    childrenKey: 'children',
    /**
     * 浅克隆tree,
     *
     * @param root 需要克隆的树
     * @param cfg {Object} {childrenKey, filter  } 克隆配置, 可以指定childrenKey, filter不需要克隆的属性的数组,
     *          childrenKey 会自动加到filter 当中
     */
    clone: function (root, cfg) {
        cfg = cfg || {};
        var childrenKey = cfg.childrenKey || TreeUtils.childrenKey;
        var filterKeys = cfg.filter ? cfg.filter.concat(childrenKey) : [childrenKey];

        var _tree = {};
        Object.keys(root).forEach(function (key) {
            if (!filterKeys.includes(key)) {
                _tree[key] = root[key];
            }
        });
        if (root[childrenKey]) {
            _tree[childrenKey] = [];
            root[childrenKey].forEach(function (item) {
                _tree[childrenKey].push(TreeUtils.clone(item));
            });
        }
        return _tree;
    }
};