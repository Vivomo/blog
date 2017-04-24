
var vm = avalon.define({
    $id: 'minesweeper',
    map: null,
    check: function (obj) {
        obj.checked = true;
    }
});

avalon.filters.mines = function (obj) {
    if (obj.isMines) {
        return '雷'
    }
    return obj.num || '';
};

var Minesweeper = (function () {

    return {
        row: 16,
        col: 30,
        init: function () {
            this.createMap();
            this.createMines();
            this.updateNum();
            vm.map = this.map;
            avalon.scan();
        },
        updateNum: function () {
            var row = this.row,
                col = this.col,
                map = this.map;
            for (var i = 0; i < row; i++) {
                for (var j = 0; j < col; j++) {
                    if (!map[i][j].isMines) {
                        var num = 0;
                        for (var _i = Math.max(i-1, 0), limitI = Math.min(i + 1, row - 1); _i <= limitI; _i++) {
                            for (var _j = Math.max(j-1, 0), limitJ = Math.min(j + 1, col - 1); _j <= limitJ; _j++) {
                                if (map[_i][_j].isMines) {
                                    num ++;
                                }
                            }
                        }
                        map[i][j].num = num;
                    }
                }
            }
        },
        createMap: function () {
            this.map = avalon.range(0, this.row).map(function () {
                return avalon.range(0, this.col).map(function () {
                    return {
                        isMines: false,
                        num: 0,
                        checked: false
                    }
                })
            }.bind(this));
        },
        createMines: function (num) {
            num = num || 99;
            for (var i = 0; i < num; i++) {
                do {
                    var randomRow = ~~ (Math.random() * this.row),
                        randomCol = ~~ (Math.random() * this.col);
                } while (this.map[randomRow][randomCol].isMines);
                this.map[randomRow][randomCol].isMines = true;
            }
        }
    }
})();

Minesweeper.init();
