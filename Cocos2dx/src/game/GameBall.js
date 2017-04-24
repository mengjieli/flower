"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameBall = function (_flower$Sprite) {
    _inherits(GameBall, _flower$Sprite);

    function GameBall() {
        _classCallCheck(this, GameBall);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameBall).call(this));

        _this.image = new flower.Image();
        //this.image.x = this.image.y = -25;
        _this.addChild(_this.image);

        _this.ball = new Ball();
        flower.EnterFrame.add(_this.update, _this);
        return _this;
    }

    /**
     * 射击球
     * @param f 力度，默认为 1 ，范围从 0 ~ 1
     * @param rot 角度，默认为 0
     * @param pointX 击球点 x ，范围 0 ~ 1 ，默认为 0.5 ，左下角为 0
     * @param pointY 击球点 y ，范围 0 ~ 1 ，默认为 0.5 ，左下角为 0
     * @param spinRot 旋转角度（扎杆）角度，默认为 0
     */


    /**
     * 框架中 Ball 对象的引用
     */


    _createClass(GameBall, [{
        key: "shoot",
        value: function shoot() {
            var f = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
            var rot = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var pointX = arguments.length <= 2 || arguments[2] === undefined ? 0.5 : arguments[2];
            var pointY = arguments.length <= 3 || arguments[3] === undefined ? 0.5 : arguments[3];
            var spinRot = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

            this.ball.shoot(f, rot, pointX, pointY, spinRot);
        }
    }, {
        key: "update",
        value: function update() {
            //if (this.parent && (super.x != this.ball.x || super.y != this.ball.y)) {
            //    var rect = new flower.Rect();
            //    rect.width = 2;
            //    rect.height = 2;
            //    rect.fillColor = 0;
            //    this.parent.addChild(rect);
            //    rect.x = super.x;
            //    rect.y = super.y;
            //}
            _set(Object.getPrototypeOf(GameBall.prototype), "x", this.ball.x, this);
            _set(Object.getPrototypeOf(GameBall.prototype), "y", this.ball.y, this);
            var rot = this.ball.rotX;
            this.image.rotation = rot * 180 / Math.PI;
            rot += Math.PI / 4;
            this.image.x = -12.5 * 1.414 * Math.cos(rot);
            this.image.y = -12.5 * 1.414 * Math.sin(rot);
        }
    }, {
        key: "source",
        set: function set(url) {
            this.image.source = url;
        }
    }, {
        key: "x",
        set: function set(val) {
            this.ball.x = val;
            _set(Object.getPrototypeOf(GameBall.prototype), "x", this.ball.x, this);
        },
        get: function get() {
            return this.ball.x;
        }
    }, {
        key: "y",
        set: function set(val) {
            this.ball.y = val;
            _set(Object.getPrototypeOf(GameBall.prototype), "y", this.ball.y, this);
        },
        get: function get() {
            return this.ball.y;
        }
    }, {
        key: "size",
        set: function set(val) {
            this.ball.size = val;
        },
        get: function get() {
            return this.ball.size;
        }
    }]);

    return GameBall;
}(flower.Sprite);