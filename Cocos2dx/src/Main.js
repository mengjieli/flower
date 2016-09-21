"use strict";

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Main = function () {
    function Main() {
        _classCallCheck(this, Main);

        flower.start(this.ready.bind(this));
    }

    _createClass(Main, [{
        key: "ready",
        value: function ready() {
            var xml =
                '<f:Group x="100" y="100" width="1010" height="500" xmlns:f="flower">' +
                    '<f:Rect fillColor="0x333333" percentWidth="100" percentHeight="100"/>' +
                    '<f:Scroller scrollPolicyH="on" scrollPolicyV="on" percentWidth="100" percentHeight="100">' +
                        '<f:HScrollBar percentWidth="100" height="10" bottom="0" autoVisibility="false">' +
                            '<f:Rect fillColor="0x666666" fillAlpha="0.3" percentWidth="100" percentHeight="100"/>' +
                            '<f:thumb>' +
                                '<f:Rect fillColor="0xbbbbbb"  fillAlpha="0.6" id="thumb" width="100" percentHeight="100"/>' +
                            '</f:thumb>' +
                        '</f:HScrollBar>' +
                        '<f:VScrollBar autoVisiblity="false" percentHeight="100" width="10" right="0" autoVisibility="false">' +
                            '<f:Rect fillColor="0x666666" fillAlpha="0.3" percentWidth="100" percentHeight="100"/>' +
                            '<f:thumb>' +
                                '<f:Rect fillColor="0xbbbbbb"  fillAlpha="0.6"  id="thumb" height="100" percentWidth="100"/>' +
                            '</f:thumb>' +
                        '</f:VScrollBar>' +
                        '<f:Group>' +
                            '<f:Group  width="1000" height="800">' +
                                '<f:Rect fillColor="0x668866" percentWidth="100" percentHeight="100"/>' +
                                '<f:Label fontColor="0xffffff" text="(0,0)" x="0" y="0"/>' +
                                '<f:Label fontColor="0xffffff" text="(500,0)" x="480" y="0"/>' +
                                '<f:Label fontColor="0xffffff" text="(1000,0)" x="940" y="0"/>' +
                                '<f:Label fontColor="0xffffff" text="(0,400)" x="0" y="380"/>' +
                                '<f:Label fontColor="0xffffff" text="(0,800)" x="0" y="780"/>' +
                                '<f:Label fontColor="0xffffff" text="(500,800)" x="480" y="780"/>' +
                                '<f:Label fontColor="0xffffff" text="(1000,800)" x="940" y="780"/>' +
                                '<f:Label fontColor="0xffffff" text="(1000,400)" x="940" y="380"/>' +
                            '</f:Group>' +
                        '</f:Group>' +
                    '</f:Scroller>' +
                '</f:Group>'
            //var ui = new flower.UIParser();
            //ui.parseUI(xml);
            //flower.Stage.getInstance().addChild(ui);
            //
            //return;
            var preloading = new PreLoading();
            preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        }
    }, {
        key: "loadThemeComplete",
        value: function loadThemeComplete(e) {
            e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
            var stage = flower.Stage.getInstance();
            stage.backgroundColor = 0;

            var ui = new flower.UIParser();
            ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
            //ui.parseUIAsync("modules/dungeonEditor/Main.xml");
            stage.addChild(ui);
        }
    }]);

    return Main;
}();