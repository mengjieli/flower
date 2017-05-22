"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
        _this.img.x = -30;
        _this.img.y = -30;
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
                    if (grids[this.gridY][i].chess == null) {
                        list.push(grids[this.gridY][i]);
                    } else {
                        break;
                    }
                }
                for (var i = this.gridX - 1; i >= 0; i--) {
                    if (grids[this.gridY][i].chess == null) {
                        list.push(grids[this.gridY][i]);
                    } else {
                        break;
                    }
                }
                for (var i = this.gridY + 1, len = grids.length; i < len; i++) {
                    if (grids[i][this.gridX].chess == null) {
                        list.push(grids[i][this.gridX]);
                    } else {
                        break;
                    }
                }
                for (var i = this.gridY - 1; i >= 0; i--) {
                    if (grids[i][this.gridX].chess == null) {
                        list.push(grids[i][this.gridX]);
                    } else {
                        break;
                    }
                }
            }
            return list;
        }
    }, {
        key: "setGrid",
        value: function setGrid(gridX, gridY) {
            this._gridX = gridX;
            this._gridY = gridY;
            this._grid = this._grids[this._gridY][this._gridX];
            this._grid.chess = this;
            this.x = this._grid.positionX;
            this.y = this._grid.positionY;
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
    }]);

    return Chess;
}(flower.Sprite);