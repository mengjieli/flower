"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TestEvent = function (_TestBase) {
    _inherits(TestEvent, _TestBase);

    function TestEvent() {
        _classCallCheck(this, TestEvent);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TestEvent).call(this));

        _this.addCase(new TestCase("EventDispatcher.addListener", "game", function () {
            var dispatcher = new flower.EventDispatcher();
            dispatcher.addListener("game", function (e) {
                this.getResult(e.type);
            }, this);
            setTimeout(function () {
                dispatcher.dispatchWith("game");
            }, 1000);
        }));

        _this.addCase(new TestCase("EventDispatcher.removeListener1", false, function () {
            var dispatcher = new flower.EventDispatcher();
            var endListener = function endListener() {
                dispatcher.removeListener("go", goListener, this);
                this.getResult(dispatcher.hasListener("go"));
            };
            dispatcher.addListener("end", endListener, this);
            var goListener = function goListener() {
                this.getResult(true);
            };
            dispatcher.addListener("go", goListener, this);
            dispatcher.dispatchWith("end");
        }));

        _this.addCase(new TestCase("EventDispatcher.removeListener2", true, function () {
            var dispatcher = new flower.EventDispatcher();
            var endListener = function endListener() {
                dispatcher.removeListener("end", endListener, this);
            };
            dispatcher.addListener("end", endListener, this);
            var endListener2 = function endListener2() {
                this.getResult(true);
            };
            dispatcher.addListener("end", endListener2, this);
            dispatcher.dispatchWith("end");
        }));

        _this.addCase(new TestCase("EventDispatcher.removeListener2", true, function () {
            var dispatcher = new flower.EventDispatcher();
            var endListener = function endListener() {
                dispatcher.removeListener("end", endListener2, this);
                this.getResult(true);
            };
            dispatcher.addListener("end", endListener, this);
            var endListener2 = function endListener2() {
                this.getResult(false);
            };
            dispatcher.addListener("end", endListener2, this);
            dispatcher.dispatchWith("end");
        }));
        return _this;
    }

    return TestEvent;
}(TestBase);