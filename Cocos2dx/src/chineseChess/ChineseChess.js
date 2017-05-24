"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChineseChess = function (_flower$Sprite) {
    _inherits(ChineseChess, _flower$Sprite);

    function ChineseChess() {
        _classCallCheck(this, ChineseChess);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChineseChess).call(this));

        _this.turnLabel = new flower.Label("");
        _this.addChild(_this.turnLabel);
        _this.turnLabel.y = -100;

        _this.x = 50;
        _this.y = 100;

        flower.Stage.getInstance().addChild(_this);

        _this.style = "res/xiangqi/stype_2/";

        _this.bg = new flower.Image(_this.style + "bg.png");
        _this.addChild(_this.bg);

        _this.grids = [];
        for (var y = 0; y < 10; y++) {
            _this.grids[y] = [];
            for (var x = 0; x < 9; x++) {
                var grid = new Grid(x, y, _this.style);
                _this.grids[y][x] = grid;
                grid.addListener(flower.TouchEvent.TOUCH_END, _this.onTouchGrid, _this);
                _this.addChild(grid);
            }
        }

        _this.playerColor = "r";
        _this.otherColor = "b";

        _this.chesses = [];
        _this.chesses.push(new Chess(_this.grids, 1, 1, _this.style + _this.otherColor + "_c.png", 0, 0)); //车
        _this.chesses.push(new Chess(_this.grids, 1, 2, _this.style + _this.otherColor + "_m.png", 1, 0)); //马
        _this.chesses.push(new Chess(_this.grids, 1, 3, _this.style + _this.otherColor + "_x.png", 2, 0)); //象
        _this.chesses.push(new Chess(_this.grids, 1, 4, _this.style + _this.otherColor + "_s.png", 3, 0)); //士
        _this.chesses.push(new Chess(_this.grids, 1, 5, _this.style + _this.otherColor + "_j.png", 4, 0)); //将
        _this.chesses.push(new Chess(_this.grids, 1, 4, _this.style + _this.otherColor + "_s.png", 5, 0)); //士
        _this.chesses.push(new Chess(_this.grids, 1, 3, _this.style + _this.otherColor + "_x.png", 6, 0)); //象
        _this.chesses.push(new Chess(_this.grids, 1, 2, _this.style + _this.otherColor + "_m.png", 7, 0)); //马
        _this.chesses.push(new Chess(_this.grids, 1, 1, _this.style + _this.otherColor + "_c.png", 8, 0)); //车
        _this.chesses.push(new Chess(_this.grids, 1, 6, _this.style + _this.otherColor + "_p.png", 1, 2)); //炮
        _this.chesses.push(new Chess(_this.grids, 1, 6, _this.style + _this.otherColor + "_p.png", 7, 2)); //炮
        _this.chesses.push(new Chess(_this.grids, 1, 7, _this.style + _this.otherColor + "_z.png", 0, 3)); //卒
        _this.chesses.push(new Chess(_this.grids, 1, 7, _this.style + _this.otherColor + "_z.png", 2, 3)); //卒
        _this.chesses.push(new Chess(_this.grids, 1, 7, _this.style + _this.otherColor + "_z.png", 4, 3)); //卒
        _this.chesses.push(new Chess(_this.grids, 1, 7, _this.style + _this.otherColor + "_z.png", 6, 3)); //卒
        _this.chesses.push(new Chess(_this.grids, 1, 7, _this.style + _this.otherColor + "_z.png", 8, 3)); //卒

        _this.chesses.push(new Chess(_this.grids, 2, 1, _this.style + _this.playerColor + "_c.png", 0, 9)); //车
        _this.chesses.push(new Chess(_this.grids, 2, 2, _this.style + _this.playerColor + "_m.png", 1, 9)); //马
        _this.chesses.push(new Chess(_this.grids, 2, 3, _this.style + _this.playerColor + "_x.png", 2, 9)); //象
        _this.chesses.push(new Chess(_this.grids, 2, 4, _this.style + _this.playerColor + "_s.png", 3, 9)); //士
        _this.chesses.push(new Chess(_this.grids, 2, 5, _this.style + _this.playerColor + "_j.png", 4, 9)); //将
        _this.chesses.push(new Chess(_this.grids, 2, 4, _this.style + _this.playerColor + "_s.png", 5, 9)); //士
        _this.chesses.push(new Chess(_this.grids, 2, 3, _this.style + _this.playerColor + "_x.png", 6, 9)); //象
        _this.chesses.push(new Chess(_this.grids, 2, 2, _this.style + _this.playerColor + "_m.png", 7, 9)); //马
        _this.chesses.push(new Chess(_this.grids, 2, 1, _this.style + _this.playerColor + "_c.png", 8, 9)); //车
        _this.chesses.push(new Chess(_this.grids, 2, 6, _this.style + _this.playerColor + "_p.png", 1, 7)); //炮
        _this.chesses.push(new Chess(_this.grids, 2, 6, _this.style + _this.playerColor + "_p.png", 7, 7)); //炮
        _this.chesses.push(new Chess(_this.grids, 2, 7, _this.style + _this.playerColor + "_z.png", 0, 6)); //卒
        _this.chesses.push(new Chess(_this.grids, 2, 7, _this.style + _this.playerColor + "_z.png", 2, 6)); //卒
        _this.chesses.push(new Chess(_this.grids, 2, 7, _this.style + _this.playerColor + "_z.png", 4, 6)); //卒
        _this.chesses.push(new Chess(_this.grids, 2, 7, _this.style + _this.playerColor + "_z.png", 6, 6)); //卒
        _this.chesses.push(new Chess(_this.grids, 2, 7, _this.style + _this.playerColor + "_z.png", 8, 6)); //卒

        for (var i = 0; i < _this.chesses.length; i++) {
            _this.addChild(_this.chesses[i]);
            _this.chesses[i].addListener(flower.TouchEvent.TOUCH_END, _this.onTouchChess, _this);
        }

        _this.start();
        return _this;
    }

    _createClass(ChineseChess, [{
        key: "start",
        value: function start() {
            this.turn = 2;
            this.startTurn();
        }
    }, {
        key: "startTurn",
        value: function startTurn() {
            this.turnLabel.htmlText = "轮到 " + (this.turn == 1 ? "<font color='#0000ff'>电脑" : "<font color='#ff0000'>玩家") + "</font> 下棋";
            for (var i = 0; i < this.chesses.length; i++) {
                this.chesses[i].touchEnabeld = !!(this.chesses[i].camp == this.turn);
            }
        }
    }, {
        key: "stopTurn",
        value: function stopTurn() {
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
    }, {
        key: "onTouchChess",
        value: function onTouchChess(e) {
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
    }, {
        key: "onTouchGrid",
        value: function onTouchGrid(e) {
            var grid = e.currentTarget;
            this.touchGricd(grid);
        }
    }, {
        key: "touchGricd",
        value: function touchGricd(grid) {
            if (this.turn == 2) {
                for (var i = 0; i < this.selectGrids.length; i++) {
                    if (this.selectGrids[i] == grid) {
                        if (grid.chess) {
                            this.deleteChess(grid.chess);
                        }
                        if (this.showMove1) {
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
    }, {
        key: "deleteChess",
        value: function deleteChess(chess) {
            chess.dispose();
            for (var i = 0; i < this.chesses.length; i++) {
                if (this.chesses[i] == chess) {
                    this.chesses.splice(i, 1);
                    break;
                }
            }
        }
    }]);

    return ChineseChess;
}(flower.Sprite);