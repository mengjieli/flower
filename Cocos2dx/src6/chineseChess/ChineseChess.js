class ChineseChess extends flower.Sprite {

    grids;

    chesses;

    turn;

    constructor() {
        super();

        this.turnLabel = new flower.Label("");
        this.addChild(this.turnLabel);
        this.turnLabel.y = -100;

        this.x = 50;
        this.y = 100;

        flower.Stage.getInstance().addChild(this);

        this.style = "res/xiangqi/stype_2/";

        this.bg = new flower.Image(this.style + "bg.png");
        this.addChild(this.bg);

        this.grids = [];
        for (var y = 0; y < 10; y++) {
            this.grids[y] = [];
            for (var x = 0; x < 9; x++) {
                var grid = new Grid(x, y, this.style);
                this.grids[y][x] = grid;
                grid.addListener(flower.TouchEvent.TOUCH_END, this.onTouchGrid, this);
                this.addChild(grid);
            }
        }

        this.playerColor = "r";
        this.otherColor = "b";

        this.chesses = [];
        this.chesses.push(new Chess(this.grids, 1, 1, this.style + this.otherColor + "_c.png", 0, 0)); //车
        this.chesses.push(new Chess(this.grids, 1, 2, this.style + this.otherColor + "_m.png", 1, 0)); //马
        this.chesses.push(new Chess(this.grids, 1, 3, this.style + this.otherColor + "_x.png", 2, 0)); //象
        this.chesses.push(new Chess(this.grids, 1, 4, this.style + this.otherColor + "_s.png", 3, 0)); //士
        this.chesses.push(new Chess(this.grids, 1, 5, this.style + this.otherColor + "_j.png", 4, 0)); //将
        this.chesses.push(new Chess(this.grids, 1, 4, this.style + this.otherColor + "_s.png", 5, 0)); //士
        this.chesses.push(new Chess(this.grids, 1, 3, this.style + this.otherColor + "_x.png", 6, 0)); //象
        this.chesses.push(new Chess(this.grids, 1, 2, this.style + this.otherColor + "_m.png", 7, 0)); //马
        this.chesses.push(new Chess(this.grids, 1, 1, this.style + this.otherColor + "_c.png", 8, 0)); //车
        this.chesses.push(new Chess(this.grids, 1, 6, this.style + this.otherColor + "_p.png", 1, 2)); //炮
        this.chesses.push(new Chess(this.grids, 1, 6, this.style + this.otherColor + "_p.png", 7, 2)); //炮
        this.chesses.push(new Chess(this.grids, 1, 7, this.style + this.otherColor + "_z.png", 0, 3)); //卒
        this.chesses.push(new Chess(this.grids, 1, 7, this.style + this.otherColor + "_z.png", 2, 3)); //卒
        this.chesses.push(new Chess(this.grids, 1, 7, this.style + this.otherColor + "_z.png", 4, 3)); //卒
        this.chesses.push(new Chess(this.grids, 1, 7, this.style + this.otherColor + "_z.png", 6, 3)); //卒
        this.chesses.push(new Chess(this.grids, 1, 7, this.style + this.otherColor + "_z.png", 8, 3)); //卒

        this.chesses.push(new Chess(this.grids, 2, 1, this.style + this.playerColor + "_c.png", 0, 9)); //车
        this.chesses.push(new Chess(this.grids, 2, 2, this.style + this.playerColor + "_m.png", 1, 9)); //马
        this.chesses.push(new Chess(this.grids, 2, 3, this.style + this.playerColor + "_x.png", 2, 9)); //象
        this.chesses.push(new Chess(this.grids, 2, 4, this.style + this.playerColor + "_s.png", 3, 9)); //士
        this.chesses.push(new Chess(this.grids, 2, 5, this.style + this.playerColor + "_j.png", 4, 9)); //将
        this.chesses.push(new Chess(this.grids, 2, 4, this.style + this.playerColor + "_s.png", 5, 9)); //士
        this.chesses.push(new Chess(this.grids, 2, 3, this.style + this.playerColor + "_x.png", 6, 9)); //象
        this.chesses.push(new Chess(this.grids, 2, 2, this.style + this.playerColor + "_m.png", 7, 9)); //马
        this.chesses.push(new Chess(this.grids, 2, 1, this.style + this.playerColor + "_c.png", 8, 9)); //车
        this.chesses.push(new Chess(this.grids, 2, 6, this.style + this.playerColor + "_p.png", 1, 7)); //炮
        this.chesses.push(new Chess(this.grids, 2, 6, this.style + this.playerColor + "_p.png", 7, 7)); //炮
        this.chesses.push(new Chess(this.grids, 2, 7, this.style + this.playerColor + "_z.png", 0, 6)); //卒
        this.chesses.push(new Chess(this.grids, 2, 7, this.style + this.playerColor + "_z.png", 2, 6)); //卒
        this.chesses.push(new Chess(this.grids, 2, 7, this.style + this.playerColor + "_z.png", 4, 6)); //卒
        this.chesses.push(new Chess(this.grids, 2, 7, this.style + this.playerColor + "_z.png", 6, 6)); //卒
        this.chesses.push(new Chess(this.grids, 2, 7, this.style + this.playerColor + "_z.png", 8, 6)); //卒

        for (var i = 0; i < this.chesses.length; i++) {
            this.addChild(this.chesses[i]);
            this.chesses[i].addListener(flower.TouchEvent.TOUCH_END, this.onTouchChess, this);
        }

        this.start();
    }

    start() {
        this.turn = 2;
        this.startTurn();
    }

    startTurn() {
        this.turnLabel.htmlText = "轮到 " + (this.turn == 1 ? "<font color='#0000ff'>电脑" : "<font color='#ff0000'>玩家") + "</font> 下棋";
        for (var i = 0; i < this.chesses.length; i++) {
            this.chesses[i].touchEnabeld = !!(this.chesses[i].camp == this.turn);
        }
    }

    stopTurn() {
        if (this.turn == 2) {
            if (this.selectChess) {
                this.selectChess.unselected();
                for (var i = 0; i < this.selectGrids.length; i++) {
                    this.selectGrids[i].showNotMove();
                }
                this.selectChess = null;
            }
            this.turn = 1;
        } else {
            this.turn = 2;
        }
    }

    onTouchChess(e) {
        var chess = e.currentTarget;
        if (this.turn == 2) {
            if (chess.camp == 2) {
                if (this.selectChess) {
                    this.selectChess.unselected();
                    for (var i = 0; i < this.selectGrids.length; i++) {
                        this.selectGrids[i].showNotMove();
                    }
                    this.selectChess = null;
                }
                this.selectChess = e.currentTarget;
                this.selectChess.selected();
                var grids = this.selectChess.getNextGrids();
                for (var i = 0; i < grids.length; i++) {
                    grids[i].showCanMove();
                }
                this.selectGrids = grids;
            } else {
                if (chess.grid) {
                    this.touchGricd(chess.grid);
                }
            }
        }
    }

    onTouchGrid(e) {
        var grid = e.currentTarget;
        this.touchGricd(grid);
    }

    touchGricd(grid) {
        if (this.turn == 2) {
            for (var i = 0; i < this.selectGrids.length; i++) {
                if (this.selectGrids[i] == grid) {
                    if (grid.chess) {
                        this.deleteChess(grid.chess);
                    }
                    if(this.showMove1) {
                        this.showMove1.hideMoveBox();
                        this.showMove2.hideMoveBox();
                    }
                    this.showMove1 = this.selectChess.grid;
                    this.selectChess.setGrid(grid.gridX, grid.gridY);
                    this.showMove2 = this.selectChess.grid;
                    this.showMove1.showMoveBox(this.playerColor);
                    this.showMove2.showMoveBox(this.playerColor);
                    this.stopTurn();
                    this.startTurn();
                    break;
                }
            }
        }
    }

    deleteChess(chess) {
        chess.dispose();
        for (var i = 0; i < this.chesses.length; i++) {
            if (this.chesses[i] == chess) {
                this.chesses.splice(i, 1);
                break;
            }
        }
    }
}