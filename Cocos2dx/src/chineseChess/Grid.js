"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Grid = function (_flower$Sprite) {
    _inherits(Grid, _flower$Sprite);

    function Grid(gridX, gridY, style) {
        _classCallCheck(this, Grid);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Grid).call(this));

        _this._gridX = 0;
        _this._gridY = 0;

        _this._gridX = gridX;
        _this._gridY = gridY;
        _this._positionX = 23 + 58 * gridX;
        _this._positionY = 23 + 58 * gridY;
        _this.x = _this._positionX;
        _this.y = _this._positionY;
        _this.style = style;
        return _this;
    }

    //显示能移动的格子


    _createClass(Grid, [{
        key: "showCanMove",
        value: function showCanMove() {
            this.showMoveFlag = true;
            this.showMoveImage = new flower.Image(this.style + "dot.png");
            this.showMoveImage.x = -22;
            this.showMoveImage.y = -22;
            this.addChild(this.showMoveImage);
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
        key: "positionX",
        get: function get() {
            return this._positionX;
        }
    }, {
        key: "positionY",
        get: function get() {
            return this._positionY;
        }
    }]);

    return Grid;
}(flower.Sprite);