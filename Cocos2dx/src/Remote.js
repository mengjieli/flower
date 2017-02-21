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

            return _possibleConstructorReturn(this, Object.getPrototypeOf(RemoteServer).call(this, true));
        }

        _createClass(RemoteServer, [{
            key: "start",
            value: function start(readyBack) {
                this.__readyBack = readyBack;
                this.__config = flower.sys.config.remote;
                if (this.__config.autoLink) {
                    this.connect(this.__config.server, +this.__config.port);
                } else {
                    this.__showConnectPanel();
                }
                this.register(19, this.__receiveClientList, this);
                this.registerZero(19, this.__onRemoteClientError, this);
            }
        }, {
            key: "__showConnectPanel",
            value: function __showConnectPanel() {
                var content = "\n        <f:Panel width=\"350\" height=\"250\" scaleMode=\"no_scale\" xmlns:f=\"flower\">\n            <f:Rect id=\"background\" percentWidth=\"100\" percentHeight=\"100\" lineColor=\"0x333333\" lineWidth=\"1\"\n                      fillColor=\"0xE7E7E7\"/>\n            <f:Group left=\"1\" right=\"1\" height=\"24\" top=\"1\">\n                <f:Rect id=\"titleBar\" percentWidth=\"100\" percentHeight=\"100\" fillColor=\"0xc2c2c2\"\n                          touchBegin=\"this.startDrag();\"/>\n                <f:Image id=\"iconImage\"/>\n                <f:Label id=\"titleLabel\" y=\"3\" touchEnabled=\"false\" text=\"链接 Remote 服务器\" horizontalCenter=\"0\" fontSize=\"16\"\n                         fontColor=\"0x252325\"/>\n            </f:Group>\n            <f:Group id=\"container\" left=\"1\" right=\"1\" top=\"25\" bottom=\"50\">\n                <f:Label horizontalCenter=\"-60\" verticalCenter=\"-25\" text=\"服务器地址 : \"/>\n                <f:Rect horizontalCenter=\"40\" verticalCenter=\"-25\" width=\"120\" height=\"20\"/>\n                <f:Input id=\"serverInput\" horizontalCenter=\"40\" verticalCenter=\"-25\" text=\"192.168.1.159\" width=\"120\" fontColor=\"0xff6666\"/>\n                <f:Label x=\"10\" horizontalCenter=\"-60\"  verticalCenter=\"25\" text=\"服务器端口 : \"/>\n                <f:Rect horizontalCenter=\"40\" verticalCenter=\"25\" width=\"120\" height=\"20\"/>\n                <f:Input id=\"portInput\" horizontalCenter=\"40\" verticalCenter=\"25\" text=\"9900\" width=\"120\" fontColor=\"0xff6666\"/>\n            </f:Group>\n            <f:Group left=\"1\" right=\"1\" height=\"50\" bottom=\"0\">\n                <f:Button id=\"confirmButton\" horizontalCenter=\"0\" bottom=\"10\" width=\"60\" height=\"30\">\n                    <f:Rect percentWidth=\"100\" percentHeight=\"100\" lineColor=\"0x333333\" lineWidth=\"1\" fillColor.up=\"0xE7E7E7\"\n                              fillColor.down=\"0xb3b3b3\"/>\n                    <f:Label text=\"确定\" horizontalCenter=\"0\" verticalCenter=\"0\"/>\n                </f:Button>\n            </f:Group>\n        </f:Panel>\n        ";
                var parser = new flower.UIParser();
                var ui = parser.parseUI(content);
                this.__serverInputComplete(ui);
            }
        }, {
            key: "__serverInputComplete",
            value: function __serverInputComplete(ui) {
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
            key: "resetClient",
            value: function resetClient(readyBack) {
                this.__readyBack = readyBack;
                var msg = new flower.VByteArray();
                msg.writeUInt(18);
                msg.writeUInt(0);
                msg.writeUTF("local");
                this.send(msg);
            }
        }, {
            key: "__onRemoteClientError",
            value: function __onRemoteClientError(cmd, errorCode, msg) {
                this.resetClient();
            }
        }, {
            key: "__receiveClientList",
            value: function __receiveClientList(cmd, msg) {
                var len = msg.readUInt();
                var clients = new flower.ArrayValue();
                var linkUser = this.__config.linkUser;
                var findClients = [];
                for (var i = 0; i < len; i++) {
                    var client = JSON.parse(msg.readUTF());
                    clients.push(client);
                    if (client.user == linkUser) {
                        findClients.push(client);
                    }
                }
                this.__clients = clients;
                if (findClients.length == 1) {
                    this.__client = findClients[0];
                    if (this.__config.useHttpServer) {
                        flower.URLLoader.urlHead = "http://" + this.__client.ip + ":" + this.__client.httpServerPort + "/";
                    }
                    if (this.__readyBack) {
                        this.__readyBack();
                        this.__readyBack = null;
                    }
                } else {
                    this.__showSelectClient();
                }
            }
        }, {
            key: "__showSelectClient",
            value: function __showSelectClient() {
                var content = "\n        <f:Panel width=\"300\" height=\"400\" scaleMode=\"no_scale\" xmlns:f=\"flower\">\n            <f:Rect id=\"background\" percentWidth=\"100\" percentHeight=\"100\" lineColor=\"0x333333\" lineWidth=\"1\"\n                      fillColor=\"0xE7E7E7\"/>\n            <f:Group left=\"1\" right=\"1\" height=\"24\" top=\"1\">\n                <f:Rect id=\"titleBar\" percentWidth=\"100\" percentHeight=\"100\" fillColor=\"0xc2c2c2\"\n                          touchBegin=\"this.startDrag();\"/>\n                <f:Image id=\"iconImage\"/>\n                <f:Label id=\"titleLabel\" y=\"3\" touchEnabled=\"false\" text=\"选择本地资源服务器\" horizontalCenter=\"0\" fontSize=\"16\"\n                         fontColor=\"0x252325\"/>\n            </f:Group>\n            <f:Group id=\"container\" left=\"1\" right=\"1\" top=\"25\" bottom=\"50\">\n                <f:Group percentWidth=\"100\" percentHeight=\"100\">\n                    <f:Rect percentWidth=\"100\" percentHeight=\"100\" fillColor=\"0xffffff\" lineColor=\"0xcccccc\" lineWidth=\"1\"/>\n                    <f:Scroller left=\"5\" right=\"5\" top=\"5\" bottom=\"5\">\n                        <f:Rect percentWidth=\"100\" percentHeight=\"100\" fillColor=\"0xf6f4f0\"/>\n                        <f:List id=\"list\" percentWidth=\"100\" percentHeight=\"100\" selectTime=\"touch_end\" xmlns:f=\"flower\">\n                            <f:itemRenderer>\n                                <f:ItemRenderer percentWidth=\"100\" height=\"30\">\n                                    <f:Rect percentWidth=\"100\" percentHeight=\"100\" fillColor.down=\"0xd6d4d0\"\n                                              fillColor.selectedDown=\"0x64834e\" fillColor.selectedUp=\"0x96b97d\" visible.up=\"false\"\n                                              visible.down=\"true\" visible.selectedDown=\"true\"\n                                              visible.selectedUp=\"true\"/>\n                                    <f:Label text=\"id: {data.id}   name: {data.user}   ip: {data.ip}\" horizontalCenter=\"0\" verticalCenter=\"0\" fontColor=\"0x000000\"/>\n                                </f:ItemRenderer>\n                            </f:itemRenderer>\n                        </f:List>\n                    </f:Scroller>\n                </f:Group>\n            </f:Group>\n            <f:Group left=\"1\" right=\"1\" height=\"50\" bottom=\"0\">\n                <f:Button id=\"confirmButton\" horizontalCenter=\"0\" bottom=\"10\" width=\"60\" height=\"30\">\n                    <f:Rect percentWidth=\"100\" percentHeight=\"100\" lineColor=\"0x333333\" lineWidth=\"1\" fillColor.up=\"0xE7E7E7\"\n                              fillColor.down=\"0xb3b3b3\"/>\n                    <f:Label text=\"确定\" horizontalCenter=\"0\" verticalCenter=\"0\"/>\n                </f:Button>\n            </f:Group>\n        </f:Panel>\n        ";
                var parser = new flower.UIParser();
                var ui = parser.parseUI(content);
                this.__clientChooseComplete(ui);
            }
        }, {
            key: "__clientChooseComplete",
            value: function __clientChooseComplete(ui) {
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
                var list = ui.list;
                ui.list.dataProvider = this.__clients;
                ui.confirmButton.click = function (e) {
                    ui.dispose();
                    if (list.selectedItem) {
                        _this.__client = list.selectedItem;
                        if (_this.__config.useHttpServer) {
                            flower.URLLoader.urlHead = "http://" + _this.__client.ip + ":" + _this.__client.httpServerPort + "/";
                        }
                        if (_this.__readyBack) {
                            _this.__readyBack();
                            _this.__readyBack = null;
                        }
                    }
                };
            }
        }, {
            key: "onConnect",
            value: function onConnect() {
                _get(Object.getPrototypeOf(RemoteServer.prototype), "onConnect", this).call(this);
                var msg = new flower.VByteArray();
                msg.writeUInt(1);
                msg.writeUInt(0);
                msg.writeUTF("game");
                msg.writeUTF("paik");
                this.send(msg);
                this.resetClient(this.__readyBack);
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
        }, {
            key: "severIp",
            get: function get() {
                return this.__config.server;
            }
        }, {
            key: "severPort",
            get: function get() {
                return this.__config.port;
            }
        }, {
            key: "httpURL",
            get: function get() {
                return "http://" + this.__client.ip + ":" + this.__client.httpServerPort + "/";
            }
        }, {
            key: "remoteClientId",
            get: function get() {
                return this.__client.id;
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

    var Remote = function () {
        function Remote(back, thisObj) {
            _classCallCheck(this, Remote);

            this.__id = Remote.id++;
            this.back = back;
            this.thisObj = thisObj;
            RemoteServer.getInstance().registerRemote(this);
        }

        _createClass(Remote, [{
            key: "send",
            value: function send(msg) {
                RemoteServer.getInstance().send(msg);
            }
        }, {
            key: "receive",
            value: function receive(cmd, bytes) {
                if (this.back) {
                    this.back.call(this.thisObj, cmd, bytes, this);
                }
            }
        }, {
            key: "dispose",
            value: function dispose() {
                RemoteServer.getInstance().removeRemote(this);
            }
        }, {
            key: "id",
            get: function get() {
                return this.__id;
            }
        }, {
            key: "remoteClientId",
            get: function get() {
                return RemoteServer.getInstance().remoteClientId;
            }
        }]);

        return Remote;
    }();

    Remote.id = 1;

    remote.Remote = Remote;
    //////////////////////////End File:remote/Remote.js///////////////////////////

    //////////////////////////File:remote/RemoteFile.js///////////////////////////

    var RemoteFile = function () {
        function RemoteFile(path) {
            var autoUpdate = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            _classCallCheck(this, RemoteFile);

            this.__path = path;
            this.__autoUpdate = autoUpdate;
        }

        _createClass(RemoteFile, [{
            key: "saveText",
            value: function saveText(text, back, thisObj) {
                new SaveFileRemote(back, thisObj, this.__path, text, "text");
            }
        }, {
            key: "savePNG",
            value: function savePNG(colors, width, height, back, thisObj) {
                new SaveFileRemote(back, thisObj, this.__path, colors, "png", width, height);
            }
        }, {
            key: "readImageData",
            value: function readImageData(back, thisObj) {
                new ReadImageDataRemote(back, thisObj, this.__path);
            }
        }, {
            key: "readImageDetail",
            value: function readImageDetail(back, thisObj) {
                new ReadImageDetailRemote(back, thisObj, this.__path);
            }
        }, {
            key: "isExist",
            value: function isExist(back, thisObj) {
                new IsDirectionExistRemote(back, thisObj, this.__path);
            }
        }, {
            key: "delete",
            value: function _delete(back, thisObj) {
                new DeleteFileRemote(back, thisObj, this.__path);
            }
        }]);

        return RemoteFile;
    }();

    remote.RemoteFile = RemoteFile;
    //////////////////////////End File:remote/RemoteFile.js///////////////////////////

    //////////////////////////File:remote/RemoteDirection.js///////////////////////////

    var RemoteDirection = function (_flower$EventDispatch) {
        _inherits(RemoteDirection, _flower$EventDispatch);

        function RemoteDirection(path) {
            var autoUpdate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            _classCallCheck(this, RemoteDirection);

            var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(RemoteDirection).call(this));

            _this3.__path = path;
            _this3.__autoUpdate = autoUpdate;
            _this3.__list = new flower.ArrayValue();
            _this3.__pathList = [];
            if (_this3.__path && _this3.__autoUpdate) {
                new ReadDirectionListRemote(_this3.__updateDirectionList, _this3, _this3.__path, _this3.__autoUpdate);
            }
            return _this3;
        }

        _createClass(RemoteDirection, [{
            key: "isExist",
            value: function isExist(back, thisObj) {
                new IsDirectionExistRemote(back, thisObj, this.__path);
            }
        }, {
            key: "readDirectionList",
            value: function readDirectionList(back, thisObj) {
                new ReadDirectionListRemote(back, thisObj, this.__path);
            }
        }, {
            key: "__updateDirectionList",
            value: function __updateDirectionList(fileList) {
                var list = this.__list;
                var clazz = this.__fileClass;
                var last = 0;
                if (this.__typeFilter) {
                    for (var i = 0; i < fileList.length; i++) {
                        if (fileList[i].isDirection) continue;
                        var findType = false;
                        for (var t = 0; t < this.__typeFilter.length; t++) {
                            if (this.__typeFilter[t] == fileList[i].fileType) {
                                findType = true;
                                break;
                            }
                        }
                        if (!findType) {
                            fileList.splice(i, 1);
                            i--;
                        }
                    }
                }
                for (var i = 0, len = fileList.length; i < len; i++) {
                    var find = false;
                    var deleteEnd = this.__pathList.length;
                    for (var f = last; f < this.__pathList.length; f++) {
                        if (this.__pathList[f] == fileList[i].path) {
                            find = true;
                            deleteEnd = f;
                            break;
                        }
                    }
                    while (last < deleteEnd) {
                        this.__pathList.splice(last, 1);
                        list.removeItemAt(last);
                        deleteEnd--;
                    }
                    last = deleteEnd + 1;
                    if (!find) {
                        this.__pathList.push(fileList[i].path);
                        if (clazz) {
                            list.push(new clazz(fileList[i]));
                        } else {
                            list.push(fileList[i]);
                        }
                    }
                }
                while (this.__pathList.length > fileList.length) {
                    this.__pathList.splice(fileList.length, 1);
                    list.removeItemAt(fileList.length);
                }
                this.dispatchWith(flower.Event.CHANGE);
            }
        }, {
            key: "dispose",
            value: function dispose() {}
        }, {
            key: "typeFilter",
            get: function get() {
                return this.__typeFilter.concat();
            },
            set: function set(val) {
                this.__typeFilter = val;
            }
        }, {
            key: "list",
            get: function get() {
                return this.__list;
            }
        }, {
            key: "fileClass",
            get: function get() {
                return this.__fileClass;
            },
            set: function set(clazz) {
                this.__fileClass = clazz;
                var list = this.__list;
                var fileList = list.list;
                list.length = 0;
                for (var i = 0, len = fileList.length; i < len; i++) {
                    if (clazz) {
                        list.push(new clazz(fileList));
                    } else {
                        list.push(fileList);
                    }
                }
            }
        }, {
            key: "path",
            get: function get() {
                return this.__path;
            },
            set: function set(val) {
                if (this.__path) {
                    sys.$error(4001, val);
                    return;
                }
                this.__path = val;
                if (this.__path && this.__autoUpdate) {
                    new ReadDirectionListRemote(this.__updateDirectionList, this, this.__path);
                }
            }
        }]);

        return RemoteDirection;
    }(flower.EventDispatcher);

    remote.RemoteDirection = RemoteDirection;
    //////////////////////////End File:remote/RemoteDirection.js///////////////////////////

    //////////////////////////File:remote/language/zh_CN.js///////////////////////////
    var locale_strings = flower.sys.$locale_strings["zh_CN"];

    locale_strings[4001] = "Direction 设置过 path 不可重新赋值:{0}";

    //////////////////////////End File:remote/language/zh_CN.js///////////////////////////

    //////////////////////////File:remote/remotes/IsDirectionExistRemote.js///////////////////////////

    var IsDirectionExistRemote = function (_Remote) {
        _inherits(IsDirectionExistRemote, _Remote);

        function IsDirectionExistRemote(back, thisObj, path) {
            _classCallCheck(this, IsDirectionExistRemote);

            var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(IsDirectionExistRemote).call(this));

            _this4.__back = back;
            _this4.__thisObj = thisObj;

            var msg = new flower.VByteArray();
            msg.writeUInt(20);
            msg.writeUInt(_this4.remoteClientId);
            msg.writeUInt(100);
            msg.writeUInt(_this4.id);
            msg.writeUTF(path);
            _this4.send(msg);
            return _this4;
        }

        _createClass(IsDirectionExistRemote, [{
            key: "receive",
            value: function receive(cmd, msg) {
                if (this.__back) {
                    this.__back.call(this.__thisObj, msg.readBoolean());
                }
                this.__back = this.__thisObj = null;
                this.dispose();
            }
        }]);

        return IsDirectionExistRemote;
    }(Remote);
    //////////////////////////End File:remote/remotes/IsDirectionExistRemote.js///////////////////////////

    //////////////////////////File:remote/remotes/ReadDirectionListRemote.js///////////////////////////


    var ReadDirectionListRemote = function (_Remote2) {
        _inherits(ReadDirectionListRemote, _Remote2);

        function ReadDirectionListRemote(back, thisObj, path) {
            var autoUpdate = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

            _classCallCheck(this, ReadDirectionListRemote);

            var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(ReadDirectionListRemote).call(this));

            _this5.__back = back;
            _this5.__thisObj = thisObj;

            var msg = new flower.VByteArray();
            msg.writeUInt(20);
            msg.writeUInt(_this5.remoteClientId);
            msg.writeUInt(102);
            msg.writeUInt(_this5.id);
            msg.writeUTF(path);
            msg.writeUTF(autoUpdate);
            _this5.send(msg);
            _this5.autoUpdate = autoUpdate;
            return _this5;
        }

        _createClass(ReadDirectionListRemote, [{
            key: "receive",
            value: function receive(cmd, msg) {
                var list = [];
                var len = msg.readUInt();
                for (var i = 0; i < len; i++) {
                    var isDirection = msg.readUInt();
                    var path = msg.readUTF();
                    list.push({
                        isDirection: isDirection == 0 ? true : false,
                        path: path,
                        name: flower.Path.getName(path),
                        fileType: flower.Path.getFileType(path)
                    });
                }
                if (this.__back) {
                    this.__back.call(this.__thisObj, list);
                }
                if (!this.autoUpdate) {
                    this.__back = this.__thisObj = null;
                    this.dispose();
                }
            }
        }]);

        return ReadDirectionListRemote;
    }(Remote);
    //////////////////////////End File:remote/remotes/ReadDirectionListRemote.js///////////////////////////

    //////////////////////////File:remote/remotes/SaveFileRemote.js///////////////////////////


    var SaveFileRemote = function (_Remote3) {
        _inherits(SaveFileRemote, _Remote3);

        function SaveFileRemote(back, thisObj, path, data, type, width, height) {
            _classCallCheck(this, SaveFileRemote);

            var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(SaveFileRemote).call(this));

            _this6.__back = back;
            _this6.__thisObj = thisObj;
            if (typeof data == "string") {
                var len = data.length;
                var i = 0;
                var index = 0;
                while (i < len) {
                    var msg = new flower.VByteArray();
                    msg.writeUInt(20);
                    msg.writeUInt(_this6.remoteClientId);
                    msg.writeUInt(104);
                    msg.writeUInt(_this6.id);
                    msg.writeUTF(path);
                    msg.writeUTF(type);
                    msg.writeUInt(index);
                    msg.writeUInt(Math.ceil(len / 1024) - 1);
                    msg.writeUTF(data.slice(index * 1024, (index + 1) * 1024));
                    _this6.send(msg);
                    index++;
                    i += 1024;
                }
            } else if (type == "png") {
                var len = data.length;
                var i = 0;
                var index = 0;
                while (i < len) {
                    var msg = new flower.VByteArray();
                    msg.writeUInt(20);
                    msg.writeUInt(_this6.remoteClientId);
                    msg.writeUInt(104);
                    msg.writeUInt(_this6.id);
                    msg.writeUTF(path);
                    msg.writeUTF(type);
                    msg.writeUInt(index);
                    msg.writeUInt(Math.ceil(len / 1024) - 1);
                    msg.writeUInt(width);
                    msg.writeUInt(height);
                    msg.writeUInt(i + 1024 < len ? 1024 : len - i);
                    var count = 0;
                    for (var j = 0; j < 1024 && i < len; j++) {
                        msg.writeUInt(data[i]);
                        i++;
                        count++;
                    }
                    _this6.send(msg);
                    index++;
                }
            }
            return _this6;
        }

        _createClass(SaveFileRemote, [{
            key: "receive",
            value: function receive(cmd, msg) {
                var result = msg.readByte();
                if (result <= 1) {
                    if (this.__back) {
                        this.__back.call(this.__thisObj, result == 0 ? true : false);
                    }
                    this.__back = this.__thisObj = null;
                }
                this.dispose();
            }
        }]);

        return SaveFileRemote;
    }(Remote);
    //////////////////////////End File:remote/remotes/SaveFileRemote.js///////////////////////////

    //////////////////////////File:remote/remotes/DeleteFileRemote.js///////////////////////////


    var DeleteFileRemote = function (_Remote4) {
        _inherits(DeleteFileRemote, _Remote4);

        function DeleteFileRemote(back, thisObj, path) {
            _classCallCheck(this, DeleteFileRemote);

            var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(DeleteFileRemote).call(this));

            _this7.__back = back;
            _this7.__thisObj = thisObj;

            var msg = new flower.VByteArray();
            msg.writeUInt(20);
            msg.writeUInt(_this7.remoteClientId);
            msg.writeUInt(106);
            msg.writeUInt(_this7.id);
            msg.writeUTF(path);
            _this7.send(msg);
            return _this7;
        }

        _createClass(DeleteFileRemote, [{
            key: "receive",
            value: function receive(cmd, msg) {
                if (this.__back) {
                    this.__back.call(this.__thisObj);
                }
                this.__back = this.__thisObj = null;
                this.dispose();
            }
        }]);

        return DeleteFileRemote;
    }(Remote);
    //////////////////////////End File:remote/remotes/DeleteFileRemote.js///////////////////////////

    //////////////////////////File:remote/remotes/ReadImageDataRemote.js///////////////////////////


    var ReadImageDataRemote = function (_Remote5) {
        _inherits(ReadImageDataRemote, _Remote5);

        function ReadImageDataRemote(back, thisObj, path) {
            _classCallCheck(this, ReadImageDataRemote);

            var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(ReadImageDataRemote).call(this));

            _this8.__back = back;
            _this8.__thisObj = thisObj;

            var msg = new flower.VByteArray();
            msg.writeUInt(20);
            msg.writeUInt(_this8.remoteClientId);
            msg.writeUInt(110);
            msg.writeUInt(_this8.id);
            msg.writeUTF(path);
            _this8.send(msg);
            return _this8;
        }

        _createClass(ReadImageDataRemote, [{
            key: "receive",
            value: function receive(cmd, msg) {
                var list = [];
                var width = msg.readUInt();
                var height = msg.readUInt();
                var colors = [];
                for (var y = 0; y < height; y++) {
                    colors[y] = [];
                    for (var x = 0; x < width; x++) {
                        colors[y].push(msg.readInt());
                    }
                }
                if (this.__back) {
                    this.__back.call(this.__thisObj, colors);
                }
                this.dispose();
            }
        }]);

        return ReadImageDataRemote;
    }(Remote);
    //////////////////////////End File:remote/remotes/ReadImageDataRemote.js///////////////////////////

    //////////////////////////File:remote/remotes/ReadImageDetailRemote.js///////////////////////////


    var ReadImageDetailRemote = function (_Remote6) {
        _inherits(ReadImageDetailRemote, _Remote6);

        function ReadImageDetailRemote(back, thisObj, path) {
            _classCallCheck(this, ReadImageDetailRemote);

            var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(ReadImageDetailRemote).call(this));

            _this9.__back = back;
            _this9.__thisObj = thisObj;
            _this9.__path = path;

            var msg = new flower.VByteArray();
            msg.writeUInt(20);
            msg.writeUInt(_this9.remoteClientId);
            msg.writeUInt(112);
            msg.writeUInt(_this9.id);
            msg.writeUTF(path);
            _this9.send(msg);
            return _this9;
        }

        _createClass(ReadImageDetailRemote, [{
            key: "receive",
            value: function receive(cmd, msg) {
                var list = [];
                var width = msg.readUInt();
                var height = msg.readUInt();
                if (this.__back) {
                    this.__back.call(this.__thisObj, {
                        width: width,
                        height: height,
                        path: this.__path
                    });
                }
                this.dispose();
            }
        }]);

        return ReadImageDetailRemote;
    }(Remote);
    //////////////////////////End File:remote/remotes/ReadImageDetailRemote.js///////////////////////////
})();
for (var key in remote) {
    flower[key] = remote[key];
}