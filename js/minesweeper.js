var Minesweeper = (function () {

    return {
        row: 16,
        col: 30,
        init: function () {
            this.createMap();
            this.createMines();
            this.updateNum();

            this.vm = avalon.define({
                $id: 'minesweeper',
                map: this.map,
                check: function (obj, i, j) {
                    if (obj.isMines) {
                        Minesweeper.blow();
                        obj.checked = true;
                    } else if (obj.num === 0) {
                        Minesweeper.activeBlank(i, j);
                    }
                    obj.checked = true;
                },
                getContent: function (obj) {
                    if (!obj.checked) {
                        return '';
                    }
                    if (obj.isMines) {
                        return '☀'
                    }
                    return obj.num || '';
                },
                getClass: function (obj) {
                    if (!obj.checked) {
                        return '';
                    }
                    if (obj.isMines) {
                        return 'mines'
                    }
                    return 'num' + obj.num;
                }
            });
            avalon.scan();
        },
        updateNum: function () {
            var row = this.row,
                col = this.col,
                map = this.map;
            this.loop(function (i, j) {
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
            });
        },
        loop: function (callback) {
            var row = this.row,
                col = this.col;
            for (var i = 0; i < row; i++) {
                for (var j = 0; j < col; j++) {
                    callback(i, j);
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
        },
        blow: function () {
            var map = this.vm.map;
            this.loop(function (i, j) {
                if (map[i][j].isMines) {
                    map[i][j].checked = true;
                }
            })
        },
        activeBlank: function (i, j) {
            var item = this.vm.map[i][j];
            if (item.checked) {
                return;
            } else {
                item.checked = true;
                if (item.num !== 0) {
                    return;
                }
            }
            if (i > 0 ) {
                this.activeBlank(i - 1, j);
            }
            if (i < this.row - 1) {
                this.activeBlank(i + 1, j);
            }
            if (j > 0) {
                this.activeBlank(i, j - 1);
            }
            if (j < this.col - 1) {
                this.activeBlank(i, j + 1);
            }

        }
    }
})();

Minesweeper.init();
