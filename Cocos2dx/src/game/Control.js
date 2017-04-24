"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Control = function (_flower$Sprite) {
    _inherits(Control, _flower$Sprite);

    /**
     * 控制条
     */

    function Control() {
        _classCallCheck(this, Control);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Control).call(this));

        _this.pointX = 390;
        _this.pointY = 48;
        _this.rangePoint = 26;
        _this.maxPoint = 32;
        _this.fDirection = true;


        _this.bg = new flower.Image("res/control.png");
        _this.bg.x = 318;
        _this.addChild(_this.bg);

        _this.point = new flower.Image("res/point.png");
        _this.point.x = _this.pointX;
        _this.point.y = _this.pointY;
        _this.addChild(_this.point);
        _this.point.addListener(flower.TouchEvent.TOUCH_BEGIN, _this.touchPoint, _this);
        _this.point.addListener(flower.TouchEvent.TOUCH_MOVE, _this.touchPoint, _this);

        _this.spin = new flower.Shape();
        _this.spin.lineWidth = 1;
        _this.spin.lineColor = 0xff0000;
        _this.spin.drawLine(0, 0, 46, 0);
        _this.spin.x = 442;
        _this.spin.y = 57 + 30;
        _this.addChild(_this.spin);
        _this.spinTouch = new flower.Shape();
        _this.spinTouch.alpha = 0;
        _this.spinTouch.drawRect(0, 0, 50, 50);
        _this.spinTouch.x = 442;
        _this.spinTouch.y = 57 + 30 - 50;
        _this.addChild(_this.spinTouch);
        _this.spinTouch.addListener(flower.TouchEvent.TOUCH_MOVE, _this.touchSpin, _this);
        _this.spinTxt = new flower.Label("0°");
        _this.spinTxt.x = 442 + 30;
        _this.spinTxt.y = 57 + 30 - 50;
        _this.spinTxt.fontColor = 0xaa0000;
        _this.addChild(_this.spinTxt);

        _this.fprogressBg = new flower.Shape();
        _this.fprogressBg.lineWidth = 1;
        _this.fprogressBg.lineColor = 0;
        _this.fprogressBg.fillColor = 0x938f8f;
        _this.fprogressBg.drawRect(0, 0, 100, 20);
        _this.fprogressBg.x = 150;
        _this.addChild(_this.fprogressBg);
        _this.fTxt = new flower.Label();
        _this.fTxt.x = 150;
        _this.fTxt.y = 25;
        _this.fTxt.text = "100";
        _this.addChild(_this.fTxt);
        _this.fprogress = new flower.Shape();
        _this.fprogress.fillColor = 0xa00000;
        _this.fprogress.x = 150;
        _this.fprogress.drawRect(0, 0, 100, 20);
        _this.addChild(_this.fprogress);
        return _this;
    }

    _createClass(Control, [{
        key: "touchPoint",
        value: function touchPoint(e) {
            switch (e.type) {
                case flower.TouchEvent.TOUCH_BEGIN:
                    this.stageDragX = e.stageX;
                    this.stageDragY = e.stageY;
                    this.pointDragX = this.point.x;
                    this.pointDragY = this.point.y;
                    break;
                case flower.TouchEvent.TOUCH_MOVE:
                    this.point.x = e.stageX - this.stageDragX + this.pointDragX;
                    this.point.y = e.stageY - this.stageDragY + this.pointDragY;
                    var dis = Math.sqrt((this.point.x - this.pointX) * (this.point.x - this.pointX) + (this.point.y - this.pointY) * (this.point.y - this.pointY));
                    if (dis > this.rangePoint) {
                        dis = this.rangePoint;
                    }
                    var rot = Math.atan2(this.point.y - this.pointY, this.point.x - this.pointX);
                    this.point.x = dis * Math.cos(rot) + this.pointX;
                    this.point.y = dis * Math.sin(rot) + this.pointY;
                    break;

            }
        }
    }, {
        key: "touchSpin",
        value: function touchSpin(e) {
            this.spin.rotation = Math.atan2(e.touchY - 50, e.touchX) * 180 / Math.PI;
            if (this.spin.rotation >= 85 && this.spin.rotation < 275) {
                this.spin.rotation = 275;
            }
            if (this.spin.rotation < 85) {
                this.spin.rotation = 0;
            }
            this.spinTxt.text = this.spinRot + "°";
        }
    }, {
        key: "startF",
        value: function startF() {
            this.fprogress.scaleX = 1;
            this.fTime = flower.CoreTime.currentTime;
            flower.EnterFrame.add(this.fGo, this);
            this.fTxt.text = ~ ~(this.f * 100);
        }
    }, {
        key: "endF",
        value: function endF() {
            flower.EnterFrame.remove(this.fGo, this);
        }
    }, {
        key: "fGo",
        value: function fGo() {
            var now = flower.CoreTime.currentTime;
            if (now - this.fTime > 500) {
                if (this.fDirection) {
                    this.fprogress.scaleX += flower.CoreTime.lastTimeGap / 1000;
                    if (this.fprogress.scaleX >= 1) {
                        this.fprogress.scaleX = 1;
                        this.fDirection = false;
                    }
                } else {
                    this.fprogress.scaleX -= flower.CoreTime.lastTimeGap / 1000;
                    if (this.fprogress.scaleX <= 0) {
                        this.fprogress.scaleX = 0;
                        this.fDirection = true;
                    }
                }
            }
            this.fTxt.text = ~ ~(this.f * 100);
        }
    }, {
        key: "spinRot",
        get: function get() {
            return this.spin.rotation == 0 ? 0 : ~ ~(360 - this.spin.rotation);
        }
    }, {
        key: "pointAnchorX",
        get: function get() {
            return (this.point.x + this.maxPoint - this.pointX) / (this.maxPoint * 2);
        }
    }, {
        key: "pointAnchorY",
        get: function get() {
            return 1 - (this.point.y + this.maxPoint - this.pointY) / (this.maxPoint * 2);
        }
    }, {
        key: "f",
        get: function get() {
            return Math.round(this.fprogress.scaleX * 100) / 100;
        }
    }]);

    return Control;
}(flower.Sprite);