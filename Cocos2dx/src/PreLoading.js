"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PreLoading = function (_flower$EventDispatch) {
    _inherits(PreLoading, _flower$EventDispatch);

    function PreLoading() {
        _classCallCheck(this, PreLoading);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PreLoading).call(this));

        _this.progress = new flower.NumberValue();
        _this.modules = [new flower.Module("modules/software/module.json"), new flower.Module("modules/gameEditor/module.json")];
        _this.progressBar = new flower.UIParser().parseUI("\n        <f:Group width=\"150\" height=\"20\" class=\"PreLoading\" xmlns:f=\"flower\">\n            <f:script src=\"./PreLoading.js\"/>\n            <f:RectUI percentWidth=\"100\" percentHeight=\"100\" lineColor=\"0x333333\" lineWidth=\"1\" fillColor=\"0xE7E7E7\"/>\n            <f:RectUI percentWidth=\"{data*100}\" percentHeight=\"100\" fillColor=\"0x3d3d3d\"/>\n        </f:Group>\n        ", _this.progress);
        flower.PopManager.pop(_this.progressBar, true, true);
        _this.index = 0;
        _this.loadNextModule();
        return _this;
    }

    _createClass(PreLoading, [{
        key: "loadNextModule",
        value: function loadNextModule() {
            if (this.index < this.modules.length) {
                this.module = this.modules[this.index];
                this.module.progress.percent.addListener(flower.Event.UPDATE, this.onUpdate, this);
                this.module.load();
            } else {
                this.dispose();
            }
        }
    }, {
        key: "onUpdate",
        value: function onUpdate(e) {
            var data = this.module.progress;
            this.progress.value = (this.index + data.percent.value) / this.modules.length;
            if (data.percent.value == 1) {
                this.index++;
                this.loadNextModule();
            }
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this.dispatchWidth(flower.Event.COMPLETE);
            this.progress.dispose();
            this.progressBar.dispose();
            _get(Object.getPrototypeOf(PreLoading.prototype), "dispose", this).call(this);
        }
    }]);

    return PreLoading;
}(flower.EventDispatcher);