var Minesweeper = (function () {

    document.getElementById('minesweeper').oncontextmenu = function (e) {
        e.preventDefault();
    };


    return {
        row: 16,
        col: 30,
        minesNum: 60,
        init: function () {
            this.createMap();
            this.createMines();
            this.updateNum();

            var vm = this.vm = avalon.define({
                $id: 'minesweeper',
                map: this.map,
                time: 0,
                minesNum: this.minesNum,
                started: false,
                gameOver: false,
                win: false,
                check: function (obj, i, j, event) {

                    if (obj.checked) {
                        return;
                    }
                    if (!vm.started) {
                        Minesweeper.countdown();
                        vm.started = true;
                    }
                    if (event.button == 0) {
                        if (obj.marked) {
                            obj.marked = false;
                            vm.minesNum ++;
                        }
                        if (obj.isMines) {
                            Minesweeper.blow();
                            vm.gameOver = true;
                            clearInterval(Minesweeper.interval);
                            obj.checked = true;
                        } else if (obj.num === 0) {
                            Minesweeper.activeBlank(i, j);
                        }
                        obj.checked = true;
                    } else if (event.button == 2) {
                        obj.marked = !obj.marked;
                        if (obj.marked) {
                            vm.minesNum --
                        }
                    }

                },
                getContent: function (obj) {
                    if (obj.marked) {
                        return '☠';
                    }
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
                },
                getGameState: function () {
                    return vm.gameOver ? '☹' : '☺';
                },
                restart: function () {
                    if (vm.gameOver || vm.win) {
                        Minesweeper.restart();
                    }
                }
            });
            avalon.scan();

            vm.$watch('minesNum', function (now) {
                if (now == 0) {
                    Minesweeper.checkOver();
                }
            })
        },
        checkOver: function () {
            var map = this.vm.map;
            var allRight = true;
            this.loop(function (i, j) {
                if (map[i][j].isMines && !map[i][j].marked) {
                    return allRight = false;
                }
            });
            if (allRight) {
                this.win();
            }
        },
        win: function () {
            clearInterval(this.interval);
            this.vm.win = true;
            alert('Nice!');
        },
        restart: function () {
            clearInterval(this.interval);
            this.createMap();
            this.createMines();
            this.updateNum();
            this.initVm();
        },
        initVm: function () {
            var vm = this.vm;
            vm.map = this.map;
            vm.minesNum = this.minesNum;
            vm.time = 0;
            vm.gameOver = vm.started = false;

        },
        countdown: function () {
            this.interval = setInterval(function () {
                this.vm.time ++;
            }.bind(this), 1000);
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
                    if(callback(i, j) === false) {
                        return;
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
                        checked: false,
                        marked: false
                    }
                })
            }.bind(this));
        },
        createMines: function () {
            var pattern = /\d+/.exec(location.hash),
                num = this.minesNum;
            if (pattern) {
                this.minesNum = num = Math.max(1,Math.min(~~ pattern[0], 300));
            }
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
                    map[i][j].marked = false;
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
