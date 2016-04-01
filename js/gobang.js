var Gobang = {
    me : true,
    chessBoard : [],
    theme : '#4EA9F3',
    context : null,
    wins : [], // 所有赢法
    blackWin : [],
    whiteWin : [],
    chess : null,
    count : 0,
    over : false,
    blackValue : [0, 200, 400, 2000, 10000],
    whiteValue : [0, 220, 420, 2100, 20000],
    init : function () {
        this.initChess();
        this.initWins();
        this.initEvent();
    },
    initChess : function () {
        for (var i = 0; i < 15; i++) {
            this.chessBoard[i] = new Array(15)
        }
        var chess = this.chess = document.getElementById('chess');
        var context = this.context = chess.getContext('2d');
        context.strokeStyle = this.theme;
        this.drawWatermark();
    },
    initWins : function () {
        var i, j, k, count = 0;
        for (i = 0; i < 15; i++) {
            this.wins[i] = [];
            for (j = 0; j < 15; j ++) {
                this.wins[i][j] = []
            }
        }

        for (i = 0; i < 15; i++) {
            for (j = 0; j < 11; j++) {
                for (k = 0; k < 5; k++) {
                    this.wins[i][j + k][count] = true;
                }
                count ++;
            }
        }

        for (i = 0; i < 15; i++) {
            for (j = 0; j < 11; j++) {
                for (k = 0; k < 5; k++) {
                    this.wins[j + k][i][count] = true;
                }
                count ++;
            }
        }

        for (i = 0; i < 11; i++) {
            for (j = 0; j < 11; j++) {
                for (k = 0; k < 5; k++) {
                    this.wins[i + k][j + k][count] = true;
                }
                count ++;
            }
        }
        for (i = 0; i < 11; i++) {
            for (j = 14; j > 3; j--) {
                for (k = 0; k < 5; k++) {
                    this.wins[i + k][j - k][count] = true;
                }
                count ++;
            }
        }
        this.count = count;
        for (i = 0; i < count; i++) {
            this.blackWin[i] = this.whiteWin[i] = 0;
        }
    },
    initEvent : function () {
        this.chess.addEventListener('click', function (e) {
            if (this.over || !this.me) {
                return;
            }
            var x = ~~ ( e.offsetX / 30);
            var y = ~~ (e.offsetY / 30);

            if (this.chessBoard[x][y] === undefined) {
                this.chessBoard[x][y] = 1;
                this.oneStep(x, y, this.me);

                for (var k = 0, count = this.count; k < count; k++) {
                    if (this.wins[x][y][k]) {
                        this.blackWin[k] ++;
                        this.whiteWin[k] = 6;
                        if (this.blackWin[k] == 5) {
                            alert('You win!');
                            this.over = true;
                        }
                    }
                }
                if (!this.over) {
                    this.me = !this.me;
                    this.AIRun();
                }
            }
        }.bind(this));
    },
    AIRun : function(){
        var myScore = [],
            AIScore = [],
            max = 0,
            x = 0,
            y = 0,
            count = this.count, i, j, k;

        for (i = 0; i < 15; i++) {
            AIScore[i] = myScore[i] = [];
            for (j = 0; j < 15; j++) {
                myScore[i][j] = AIScore[i][j] = 0;
            }
        }

        for (i = 0; i < 15; i++) {
            for (j = 0; j < 15; j ++) {
                if (this.chessBoard[i][j] == 0) {
                    for (k = 0; k < count; k++) {
                        if (this.wins[i][j][k]) {
                            myScore[i][j] += this.blackValue[this.blackWin[k]];
                            AIScore[i][j] += this.whiteValue[this.whiteWin[k]];
                        }
                    }
                    if (myScore[i][j] > max) {
                        max = myScore[i][j];
                        x = i;
                        y = j;
                    } else if (myScore[i][j] == max) {
                        if (AIScore[i][j] > AIScore[x][y]) {
                            x = i;
                            y = j;
                        }
                    }
                }
            }
        }

    },
    drawWatermark : function () {
        var watermark = new Image;
        watermark.src = "http://img.saihuitong.com/8/albumImg/22/153d0915e40.jpg?imageMogr2/thumbnail/450x450";
        watermark.onload = function () {
            this.context.drawImage(watermark, 0, 0);
            this.drawChessBoard();
        }.bind(this);
    },
    drawChessBoard : function () {
        var context = this.context;
        for (var i = 0; i < 15; i++) {
            context.moveTo(15 + i * 30, 15);
            context.lineTo(15 + i * 30, 435);
            context.stroke();
            context.moveTo(15, 15 + i * 30);
            context.lineTo(435, 15 + i *  30);
            context.stroke();
        }
    },
    oneStep : function (x, y, type) {
        var context = this.context;
        context.beginPath();
        context.arc(15 + x * 30, 15 + y * 30, 13, 0, 2 * Math.PI);
        context.closePath();

        var gradient = context.createRadialGradient(15 + x * 30 + 2, 15 + y * 30 - 2, 13, 15 + x * 30 + 2, 15 + y * 30 - 2, 0);
        if (type) {
            gradient.addColorStop(0, '#0A0A0A');
            gradient.addColorStop(1, '#636766');
        } else {
            gradient.addColorStop(0, '#d1d1d1');
            gradient.addColorStop(1, '#f9f9f9');
        }

        context.fillStyle = gradient;
        context.fill();
    }
};

Gobang.init();