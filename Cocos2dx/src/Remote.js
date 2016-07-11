"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var remote = {};
(function () {
    //////////////////////////File:remote/RemoteServer.js///////////////////////////

    var RemoteServer = function (_flower$VBWebSocket) {
        _inherits(RemoteServer, _flower$VBWebSocket);

        function RemoteServer() {
            _classCallCheck(this, RemoteServer);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(RemoteServer).call(this));
        }

        _createClass(RemoteServer, [{
            key: "start",
            value: function start(readyBack) {
                this.__readyBack = readyBack;
                this.__config = flower.sys.config.remote;
                this.__showConnectPanel();
            }
        }, {
            key: "__showConnectPanel",
            value: function __showConnectPanel() {
                var content = "\n        <f:Panel width=\"350\" height=\"250\" scaleMode=\"no_scale\" xmlns:f=\"flower\">\n            <f:RectUI id=\"background\" percentWidth=\"100\" percentHeight=\"100\" lineColor=\"0x333333\" lineWidth=\"1\"\n                      fillColor=\"0xE7E7E7\"/>\n            <f:Group left=\"1\" right=\"1\" height=\"24\" top=\"1\">\n                <f:RectUI id=\"titleBar\" percentWidth=\"100\" percentHeight=\"100\" fillColor=\"0xc2c2c2\"\n                          touchBegin=\"this.startDrag();\"/>\n                <f:Image id=\"iconImage\"/>\n                <f:Label id=\"titleLabel\" y=\"3\" touchEnabled=\"false\" text=\"链接 Remote 服务器\" horizontalCenter=\"0\" fontSize=\"16\"\n                         fontColor=\"0x252325\"/>\n            </f:Group>\n            <f:Group id=\"container\" left=\"1\" right=\"1\" top=\"25\" bottom=\"50\">\n                <f:Label horizontalCenter=\"-60\" verticalCenter=\"-25\" text=\"服务器地址 : \"/>\n                <f:RectUI horizontalCenter=\"40\" verticalCenter=\"-25\" width=\"120\" height=\"20\"/>\n                <f:Input id=\"serverInput\" horizontalCenter=\"40\" verticalCenter=\"-25\" text=\"192.168.1.159\" width=\"120\" fontColor=\"0xff6666\"/>\n                <f:Label x=\"10\" horizontalCenter=\"-60\"  verticalCenter=\"25\" text=\"服务器端口 : \"/>\n                <f:RectUI horizontalCenter=\"40\" verticalCenter=\"25\" width=\"120\" height=\"20\"/>\n                <f:Input id=\"portInput\" horizontalCenter=\"40\" verticalCenter=\"25\" text=\"9900\" width=\"120\" fontColor=\"0xff6666\"/>\n            </f:Group>\n            <f:Group left=\"1\" right=\"1\" height=\"50\" bottom=\"0\">\n                <f:Button id=\"confirmButton\" horizontalCenter=\"0\" bottom=\"10\" width=\"60\" height=\"30\">\n                    <f:RectUI percentWidth=\"100\" percentHeight=\"100\" lineColor=\"0x333333\" lineWidth=\"1\" fillColor.up=\"0xE7E7E7\"\n                              fillColor.down=\"0xb3b3b3\"/>\n                    <f:Label text=\"确定\" horizontalCenter=\"0\" verticalCenter=\"0\"/>\n                </f:Button>\n            </f:Group>\n        </f:Panel>\n        ";
                var ui = new flower.UIParser();
                ui.parseUI(content);
                ui.addListener(flower.Event.COMPLETE, this.__serverInputComplete, this);
            }
        }, {
            key: "__serverInputComplete",
            value: function __serverInputComplete(e) {
                var ui = e.data;
                if (this.__config) {
                    ui.serverInput.text = this.__config.server;
                    ui.portInput.text = this.__config.port;
                }
                flower.PopManager.pop(ui, true);
                flower.Tween.to(ui, 0.3, {
                    x: (ui.parent.width - ui.width) / 2,
                    y: (ui.parent.height - ui.height) / 2,
                    scaleX: 1,
                    scaleY: 1
                }, flower.Ease.BACK_EASE_OUT, {
                    x: ui.parent.width / 2,
                    y: ui.parent.height / 2,
                    scaleX: 0,
                    scaleY: 0
                });
                var _this = this;
                ui.confirmButton.click = function (e) {
                    _this.connect(ui.serverInput.text, +ui.portInput.text);
                    ui.dispose();
                };
            }
        }, {
            key: "onConnect",
            value: function onConnect() {
                _get(Object.getPrototypeOf(RemoteServer.prototype), "onConnect", this).call(this);
                if (this.__readyBack) {
                    this.__readyBack();
                }
                var msg = new flower.VByteArray();
                msg.writeUInt(1);
                msg.writeUTF("game");
                msg.writeUTF("paik");
                this.send(msg);
            }
        }, {
            key: "onError",
            value: function onError() {
                _get(Object.getPrototypeOf(RemoteServer.prototype), "onConnect", this).call(this);
                this.__showConnectPanel();
            }
        }, {
            key: "onClose",
            value: function onClose() {
                _get(Object.getPrototypeOf(RemoteServer.prototype), "onConnect", this).call(this);
                this.__showConnectPanel();
            }
        }], [{
            key: "getInstance",
            value: function getInstance() {
                if (!RemoteServer.instance) {
                    RemoteServer.instance = new RemoteServer();
                }
                return RemoteServer.instance;
            }
        }, {
            key: "start",
            value: function start(readyBack) {
                RemoteServer.getInstance().start(readyBack);
            }
        }]);

        return RemoteServer;
    }(flower.VBWebSocket);

    remote.RemoteServer = RemoteServer;
    //////////////////////////End File:remote/RemoteServer.js///////////////////////////

    //////////////////////////File:remote/Remote.js///////////////////////////

    var Remote = function Remote() {
        _classCallCheck(this, Remote);
    };

    remote.Remote = Remote;
    //////////////////////////End File:remote/Remote.js///////////////////////////

    //////////////////////////File:remote/File.js///////////////////////////

    var File = function (_Remote) {
        _inherits(File, _Remote);

        function File() {
            _classCallCheck(this, File);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(File).call(this));
        }

        return File;
    }(Remote);

    remote.File = File;
    //////////////////////////End File:remote/File.js///////////////////////////

    //////////////////////////File:remote/Direction.js///////////////////////////

    var Direction = function (_Remote2) {
        _inherits(Direction, _Remote2);

        function Direction() {
            _classCallCheck(this, Direction);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(Direction).call(this));
        }

        return Direction;
    }(Remote);

    remote.Direction = Direction;
    //////////////////////////End File:remote/Direction.js///////////////////////////
})();
for (var key in remote) {
    flower[key] = remote[key];
}