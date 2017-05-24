"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chess = function (_flower$Sprite) {
    _inherits(Chess, _flower$Sprite);

    //类型 1.车  2.马  3.象  4.士  5.将  6.炮  7.卒

    //阵营

    function Chess(grids, camp, type, source, gridX, gridY) {
        _classCallCheck(this, Chess);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chess).call(this));

        _this._grids = grids;

        _this._camp = camp;
        _this._type = type;

        _this.setGrid(gridX, gridY);

        _this.img = new flower.Image(source);
        _this.addChild(_this.img);
        //调整图片到中心
        _this.img.x = -26;
        _this.img.y = -26;
        return _this;
    }

    _createClass(Chess, [{
        key: "selected",
        value: function selected() {
            this.alpha = 0.7;
        }
    }, {
        key: "unselected",
        value: function unselected() {
            this.alpha = 1;
        }
    }, {
        key: "getNextGrids",
        value: function getNextGrids() {
            var list = [];
            var grids = this._grids;
            if (this.type == 1) {
                for (var i = this.gridX + 1, len = grids[this.gridY].length; i < len; i++) {
                    if (grids[this.gridY][i].chess == null || grids[this.gridY][i].chess.camp != this.camp) {
                        list.push(grids[this.gridY][i]);
                        if (grids[this.gridY][i].chess) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (var i = this.gridX - 1; i >= 0; i--) {
                    if (grids[this.gridY][i].chess == null || grids[this.gridY][i].chess.camp != this.camp) {
                        list.push(grids[this.gridY][i]);
                        if (grids[this.gridY][i].chess) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (var i = this.gridY + 1, len = grids.length; i < len; i++) {
                    if (grids[i][this.gridX].chess == null || grids[i][this.gridX].chess.camp != this.camp) {
                        list.push(grids[i][this.gridX]);
                        if (grids[i][this.gridX].chess) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (var i = this.gridY - 1; i >= 0; i--) {
                    if (grids[i][this.gridX].chess == null || grids[i][this.gridX].chess.camp != this.camp) {
                        list.push(grids[i][this.gridX]);
                        if (grids[i][this.gridX].chess) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            } else if (this.type == 2) {
                var poses = [[-1, 2, 0, 1], [1, 2, 0, 1], [-1, -2, 0, -1], [1, -2, 0, -1], [2, 1, 1, 0], [2, -1, 1, 0], [-2, 1, -1, 0], [-2, -1, -1, 0]];
                for (var i = 0; i < poses.length; i++) {
                    var x = this.gridX + poses[i][0];
                    var y = this.gridY + poses[i][1];
                    var x2 = this.gridX + poses[i][2];
                    var y2 = this.gridY + poses[i][3];
                    if (x >= 0 && x <= 8 && y >= 0 && y <= 9 && (grids[y][x].chess == null || grids[y][x].chess.camp != this.camp) && grids[y2][x2].chess == null) {
                        list.push(grids[y][x]);
                    }
                }
            } else if (this.type == 3) {
                var poses = [[2, 2, 1, 1], [-2, 2, -1, 1], [2, -2, 1, -1], [-2, -2, 1, -1]];
                for (var i = 0; i < poses.length; i++) {
                    var x = this.gridX + poses[i][0];
                    var y = this.gridY + poses[i][1];
                    if (y <= 4 != this.gridY <= 4) {
                        continue;
                    }
                    var x2 = this.gridX + poses[i][2];
                    var y2 = this.gridY + poses[i][3];
                    if (x >= 0 && x <= 8 && y >= 0 && y <= 9 && (grids[y][x].chess == null || grids[y][x].chess.camp != this.camp) && grids[y2][x2].chess == null) {
                        list.push(grids[y][x]);
                    }
                }
            } else if (this.type == 4) {
                var poses = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
                for (var i = 0; i < poses.length; i++) {
                    var x = this.gridX + poses[i][0];
                    var y = this.gridY + poses[i][1];
                    if (x < 3 || x > 5 || this.gridY <= 2 && y > 2 || this.gridY >= 7 && y < 7) {
                        continue;
                    }
                    if (x >= 0 && x <= 8 && y >= 0 && y <= 9 && (grids[y][x].chess == null || grids[y][x].chess.camp != this.camp)) {
                        list.push(grids[y][x]);
                    }
                }
            } else if (this.type == 5) {
                var poses = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                for (var i = 0; i < poses.length; i++) {
                    var x = this.gridX + poses[i][0];
                    var y = this.gridY + poses[i][1];
                    if (x < 3 || x > 5 || this.gridY <= 2 && y > 2 || this.gridY >= 7 && y < 7) {
                        continue;
                    }
                    if (x >= 0 && x <= 8 && y >= 0 && y <= 9 && (grids[y][x].chess == null || grids[y][x].chess.camp != this.camp)) {
                        list.push(grids[y][x]);
                    }
                }
            } else if (this.type == 6) {
                var findChess = false;
                for (var i = this.gridX + 1, len = grids[this.gridY].length; i < len; i++) {
                    if (!findChess && grids[this.gridY][i].chess == null) {
                        list.push(grids[this.gridY][i]);
                        if (grids[this.gridY][i].chess) {
                            break;
                        }
                    } else {
                        if (!findChess) {
                            findChess = true;
                        } else {
                            if (grids[this.gridY][i].chess) {
                                if (grids[this.gridY][i].chess.camp != this.camp) {
                                    list.push(grids[this.gridY][i]);
                                }
                                break;
                            }
                        }
                    }
                }
                findChess = false;
                for (var i = this.gridX - 1; i >= 0; i--) {
                    if (!findChess && grids[this.gridY][i].chess == null) {
                        list.push(grids[this.gridY][i]);
                        if (grids[this.gridY][i].chess) {
                            break;
                        }
                    } else {
                        if (!findChess) {
                            findChess = true;
                        } else {
                            if (grids[this.gridY][i].chess) {
                                if (findChess) {
                                    if (grids[this.gridY][i].chess.camp != this.camp) {
                                        list.push(grids[this.gridY][i]);
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                findChess = false;
                for (var i = this.gridY + 1, len = grids.length; i < len; i++) {
                    if (!findChess && grids[i][this.gridX].chess == null) {
                        list.push(grids[i][this.gridX]);
                        if (grids[i][this.gridX].chess) {
                            break;
                        }
                    } else {
                        if (!findChess) {
                            findChess = true;
                        } else {
                            if (grids[i][this.gridX].chess) {
                                if (findChess) {
                                    if (grids[i][this.gridX].chess.camp != this.camp) {
                                        list.push(grids[i][this.gridX]);
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                findChess = false;
                for (var i = this.gridY - 1; i >= 0; i--) {
                    if (!findChess && grids[i][this.gridX].chess == null) {
                        list.push(grids[i][this.gridX]);
                        if (grids[i][this.gridX].chess) {
                            break;
                        }
                    } else {
                        if (!findChess) {
                            findChess = true;
                        } else {
                            if (grids[i][this.gridX].chess) {
                                if (findChess) {
                                    if (grids[i][this.gridX].chess.camp != this.camp) {
                                        list.push(grids[i][this.gridX]);
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            } else if (this.type == 7) {
                var poses = [];
                if (this.camp == 1) {
                    poses.push([0, 1]);
                    if (this.gridY > 4) {
                        poses.push([-1, 0]);
                        poses.push([1, 0]);
                    }
                } else {
                    poses.push([0, -1]);
                    if (this.gridY <= 4) {
                        poses.push([-1, 0]);
                        poses.push([1, 0]);
                    }
                }
                for (var i = 0; i < poses.length; i++) {
                    var x = this.gridX + poses[i][0];
                    var y = this.gridY + poses[i][1];
                    if (x >= 0 && x <= 8 && y >= 0 && y <= 9 && (grids[y][x].chess == null || grids[y][x].chess.camp != this.camp)) {
                        list.push(grids[y][x]);
                    }
                }
            }
            return list;
        }
    }, {
        key: "setGrid",
        value: function setGrid(gridX, gridY) {
            if (this._grid) {
                this._grid.chess = null;
            }
            this._gridX = gridX;
            this._gridY = gridY;
            this._grid = this._grids[this._gridY][this._gridX];
            this._grid.chess = this;
            this.x = this._grid.positionX;
            this.y = this._grid.positionY;
        }
    }, {
        key: "dispose",
        value: function dispose() {
            if (this._grid) {
                this._grid.chess = null;
            }
            _get(Object.getPrototypeOf(Chess.prototype), "dispose", this).call(this);
        }
    }, {
        key: "camp",
        get: function get() {
            return this._camp;
        }
    }, {
        key: "gridX",
        get: function get() {
            return this._gridX;
        }
    }, {
        key: "gridY",
        get: function get() {
            return this._gridY;
        }
    }, {
        key: "type",
        get: function get() {
            return this._type;
        }
    }, {
        key: "grid",
        get: function get() {
            return this._grid;
        }
    }]);

    return Chess;
}(flower.Sprite);