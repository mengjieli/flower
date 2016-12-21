var remote = {};
(function(){
//////////////////////////File:remote/RemoteServer.js///////////////////////////
class RemoteServer extends flower.VBWebSocket {

    __readyBack;
    __config;
    __clients;
    __client;

    constructor() {
        super(true);
    }

    start(readyBack) {
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

    __showConnectPanel() {
        var content = `
        <f:Panel width="350" height="250" scaleMode="no_scale" xmlns:f="flower">
            <f:Rect id="background" percentWidth="100" percentHeight="100" lineColor="0x333333" lineWidth="1"
                      fillColor="0xE7E7E7"/>
            <f:Group left="1" right="1" height="24" top="1">
                <f:Rect id="titleBar" percentWidth="100" percentHeight="100" fillColor="0xc2c2c2"
                          touchBegin="this.startDrag();"/>
                <f:Image id="iconImage"/>
                <f:Label id="titleLabel" y="3" touchEnabled="false" text="链接 Remote 服务器" horizontalCenter="0" fontSize="16"
                         fontColor="0x252325"/>
            </f:Group>
            <f:Group id="container" left="1" right="1" top="25" bottom="50">
                <f:Label horizontalCenter="-60" verticalCenter="-25" text="服务器地址 : "/>
                <f:Rect horizontalCenter="40" verticalCenter="-25" width="120" height="20"/>
                <f:Input id="serverInput" horizontalCenter="40" verticalCenter="-25" text="192.168.1.159" width="120" fontColor="0xff6666"/>
                <f:Label x="10" horizontalCenter="-60"  verticalCenter="25" text="服务器端口 : "/>
                <f:Rect horizontalCenter="40" verticalCenter="25" width="120" height="20"/>
                <f:Input id="portInput" horizontalCenter="40" verticalCenter="25" text="9900" width="120" fontColor="0xff6666"/>
            </f:Group>
            <f:Group left="1" right="1" height="50" bottom="0">
                <f:Button id="confirmButton" horizontalCenter="0" bottom="10" width="60" height="30">
                    <f:Rect percentWidth="100" percentHeight="100" lineColor="0x333333" lineWidth="1" fillColor.up="0xE7E7E7"
                              fillColor.down="0xb3b3b3"/>
                    <f:Label text="确定" horizontalCenter="0" verticalCenter="0"/>
                </f:Button>
            </f:Group>
        </f:Panel>
        `;
        var parser = new flower.UIParser();
        var ui = parser.parseUI(content);
        this.__serverInputComplete(ui);
    }

    __serverInputComplete(ui) {
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

    resetClient(readyBack) {
        this.__readyBack = readyBack;
        var msg = new flower.VByteArray();
        msg.writeUInt(18);
        msg.writeUInt(0);
        msg.writeUTF("local");
        this.send(msg);
    }

    __onRemoteClientError(cmd, errorCode, msg) {
        this.resetClient();
    }

    __receiveClientList(cmd, msg) {
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

    __showSelectClient() {
        var content = `
        <f:Panel width="300" height="400" scaleMode="no_scale" xmlns:f="flower">
            <f:Rect id="background" percentWidth="100" percentHeight="100" lineColor="0x333333" lineWidth="1"
                      fillColor="0xE7E7E7"/>
            <f:Group left="1" right="1" height="24" top="1">
                <f:Rect id="titleBar" percentWidth="100" percentHeight="100" fillColor="0xc2c2c2"
                          touchBegin="this.startDrag();"/>
                <f:Image id="iconImage"/>
                <f:Label id="titleLabel" y="3" touchEnabled="false" text="选择本地资源服务器" horizontalCenter="0" fontSize="16"
                         fontColor="0x252325"/>
            </f:Group>
            <f:Group id="container" left="1" right="1" top="25" bottom="50">
                <f:Group percentWidth="100" percentHeight="100">
                    <f:Rect percentWidth="100" percentHeight="100" fillColor="0xffffff" lineColor="0xcccccc" lineWidth="1"/>
                    <f:Scroller left="5" right="5" top="5" bottom="5">
                        <f:Rect percentWidth="100" percentHeight="100" fillColor="0xf6f4f0"/>
                        <f:List id="list" percentWidth="100" percentHeight="100" selectTime="touch_end" xmlns:f="flower">
                            <f:itemRenderer>
                                <f:ItemRenderer percentWidth="100" height="30">
                                    <f:Rect percentWidth="100" percentHeight="100" fillColor.down="0xd6d4d0"
                                              fillColor.selectedDown="0x64834e" fillColor.selectedUp="0x96b97d" visible.up="false"
                                              visible.down="true" visible.selectedDown="true"
                                              visible.selectedUp="true"/>
                                    <f:Label text="id: {data.id}   name: {data.user}   ip: {data.ip}" horizontalCenter="0" verticalCenter="0" fontColor="0x000000"/>
                                </f:ItemRenderer>
                            </f:itemRenderer>
                        </f:List>
                    </f:Scroller>
                </f:Group>
            </f:Group>
            <f:Group left="1" right="1" height="50" bottom="0">
                <f:Button id="confirmButton" horizontalCenter="0" bottom="10" width="60" height="30">
                    <f:Rect percentWidth="100" percentHeight="100" lineColor="0x333333" lineWidth="1" fillColor.up="0xE7E7E7"
                              fillColor.down="0xb3b3b3"/>
                    <f:Label text="确定" horizontalCenter="0" verticalCenter="0"/>
                </f:Button>
            </f:Group>
        </f:Panel>
        `;
        var parser = new flower.UIParser();
        var ui = parser.parseUI(content);
        this.__clientChooseComplete(ui)
    }

    __clientChooseComplete(ui) {
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


    onConnect() {
        super.onConnect();
        var msg = new flower.VByteArray();
        msg.writeUInt(1);
        msg.writeUInt(0);
        msg.writeUTF("game");
        msg.writeUTF("paik");
        this.send(msg);
        this.resetClient(this.__readyBack);
    }

    onError() {
        super.onConnect();
        this.__showConnectPanel();
    }

    onClose() {
        super.onConnect();
        this.__showConnectPanel();
    }

    get severIp() {
        return this.__config.server;
    }

    get severPort() {
        return this.__config.port;
    }

    get httpURL() {
        return "http://" + this.__client.ip + ":" + this.__client.httpServerPort + "/";
    }

    get remoteClientId() {
        return this.__client.id;
    }

    static instance;

    static getInstance() {
        if (!RemoteServer.instance) {
            RemoteServer.instance = new RemoteServer();
        }
        return RemoteServer.instance;
    }

    static start(readyBack) {
        RemoteServer.getInstance().start(readyBack);
    }
}

remote.RemoteServer = RemoteServer;
//////////////////////////End File:remote/RemoteServer.js///////////////////////////



//////////////////////////File:remote/Remote.js///////////////////////////
class Remote {

    __id;

    constructor(back, thisObj) {
        this.__id = Remote.id++;
        this.back = back;
        this.thisObj = thisObj;
        RemoteServer.getInstance().registerRemote(this);
    }

    send(msg) {
        RemoteServer.getInstance().send(msg);
    }

    receive(cmd, bytes) {
        if (this.back) {
            this.back.call(this.thisObj, cmd, bytes, this);
        }
    }

    dispose() {
        RemoteServer.getInstance().removeRemote(this);
    }

    get id() {
        return this.__id;
    }

    get remoteClientId() {
        return RemoteServer.getInstance().remoteClientId;
    }

    static id = 1;
}
remote.Remote = Remote;
//////////////////////////End File:remote/Remote.js///////////////////////////



//////////////////////////File:remote/RemoteFile.js///////////////////////////
class RemoteFile {

    __path;
    __autoUpdate;

    constructor(path, autoUpdate = false) {
        this.__path = path;
        this.__autoUpdate = autoUpdate;
    }

    saveText(text, back, thisObj) {
        new SaveFileRemote(back, thisObj, this.__path, text, "text");
    }

    savePNG(colors, width, height, back, thisObj) {
        new SaveFileRemote(back, thisObj, this.__path, colors, "png", width, height);
    }

    isExist( back, thisObj) {
        new IsDirectionExistRemote(back, thisObj, this.__path);
    }

    delete(back, thisObj) {
        new DeleteFileRemote(back, thisObj, this.__path);
    }
}

remote.RemoteFile = RemoteFile;
//////////////////////////End File:remote/RemoteFile.js///////////////////////////



//////////////////////////File:remote/RemoteDirection.js///////////////////////////
class RemoteDirection extends flower.EventDispatcher {

    __path;
    __autoUpdate;
    __list;
    __fileClass;
    __updateRemote;

    constructor(path, autoUpdate = true) {
        super();
        this.__path = path;
        this.__autoUpdate = autoUpdate;
        this.__list = new flower.ArrayValue();
        if (this.__path && this.__autoUpdate) {
            new ReadDirectionListRemote(this.__updateDirectionList, this, this.__path, this.__autoUpdate);
        }
    }

    isExist(back, thisObj) {
        new IsDirectionExistRemote(back, thisObj, this.__path);
    }

    readDirectionList(back, thisObj) {
        new ReadDirectionListRemote(back, thisObj, this.__path);
    }

    __updateDirectionList(fileList) {
        var list = this.__list;
        list.length = 0;
        var clazz = this.__fileClass;
        for (var i = 0, len = fileList.length; i < len; i++) {
            if (clazz) {
                list.push(new clazz(fileList[i]));
            } else {
                list.push(fileList[i]);
            }
        }
        this.dispatchWith(flower.Event.CHANGE);
    }

    dispose() {

    }

    get list() {
        return this.__list;
    }

    get fileClass() {
        return this.__fileClass;
    }

    set fileClass(clazz) {
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

    get path() {
        return this.__path;
    }

    set path(val) {
        if (this.__path) {
            sys.$error(4001, val);
            return;
        }
        this.__path = val;
        if (this.__path && this.__autoUpdate) {
            new ReadDirectionListRemote(this.__updateDirectionList, this, this.__path);
        }
    }
}

remote.RemoteDirection = RemoteDirection;
//////////////////////////End File:remote/RemoteDirection.js///////////////////////////



//////////////////////////File:remote/language/zh_CN.js///////////////////////////
var locale_strings = flower.sys.$locale_strings["zh_CN"];


locale_strings[4001] = "Direction 设置过 path 不可重新赋值:{0}";

//////////////////////////End File:remote/language/zh_CN.js///////////////////////////



//////////////////////////File:remote/remotes/IsDirectionExistRemote.js///////////////////////////
class IsDirectionExistRemote extends Remote {

    __back;
    __thisObj;

    constructor(back, thisObj, path) {
        super();
        this.__back = back;
        this.__thisObj = thisObj;

        var msg = new flower.VByteArray();
        msg.writeUInt(20);
        msg.writeUInt(this.remoteClientId);
        msg.writeUInt(100);
        msg.writeUInt(this.id);
        msg.writeUTF(path);
        this.send(msg);
    }

    receive(cmd, msg) {
        if (this.__back) {
            this.__back.call(this.__thisObj, msg.readBoolean());
        }
        this.__back = this.__thisObj = null;
        this.dispose();
    }
}
//////////////////////////End File:remote/remotes/IsDirectionExistRemote.js///////////////////////////



//////////////////////////File:remote/remotes/ReadDirectionListRemote.js///////////////////////////
class ReadDirectionListRemote extends Remote {

    __back;
    __thisObj;

    constructor(back, thisObj, path, autoUpdate = false) {
        super();
        this.__back = back;
        this.__thisObj = thisObj;

        var msg = new flower.VByteArray();
        msg.writeUInt(20);
        msg.writeUInt(this.remoteClientId);
        msg.writeUInt(102);
        msg.writeUInt(this.id);
        msg.writeUTF(path);
        msg.writeUTF(autoUpdate);
        this.send(msg);
        this.autoUpdate = autoUpdate;
    }

    receive(cmd, msg) {
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
}
//////////////////////////End File:remote/remotes/ReadDirectionListRemote.js///////////////////////////



//////////////////////////File:remote/remotes/SaveFileRemote.js///////////////////////////
class SaveFileRemote extends Remote {

    __back;
    __thisObj;

    constructor(back, thisObj, path, data, type, width, height) {
        super();
        this.__back = back;
        this.__thisObj = thisObj;
        if (typeof data == "string") {
            var msg = new flower.VByteArray();
            msg.writeUInt(20);
            msg.writeUInt(this.remoteClientId);
            msg.writeUInt(104);
            msg.writeUInt(this.id);
            msg.writeUTF(path);
            msg.writeUTF(type);
            msg.writeUTF(data);
            this.send(msg);
        } else {
            var len = data.length;
            var i = 0;
            var index = 0;
            while (i < len) {
                var msg = new flower.VByteArray();
                msg.writeUInt(20);
                msg.writeUInt(this.remoteClientId);
                msg.writeUInt(104);
                msg.writeUInt(this.id);
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
                this.send(msg);
                index++;
            }
        }
    }

    receive(cmd, msg) {
        var result = msg.readByte();
        if (result <= 1) {
            if (this.__back) {
                this.__back.call(this.__thisObj, result == 0 ? true : false);
            }
            this.__back = this.__thisObj = null;
        }
        this.dispose();
    }
}
//////////////////////////End File:remote/remotes/SaveFileRemote.js///////////////////////////



//////////////////////////File:remote/remotes/DeleteFileRemote.js///////////////////////////
class DeleteFileRemote extends Remote {

    __back;
    __thisObj;

    constructor(back, thisObj, path) {
        super();
        this.__back = back;
        this.__thisObj = thisObj;

        var msg = new flower.VByteArray();
        msg.writeUInt(20);
        msg.writeUInt(this.remoteClientId);
        msg.writeUInt(106);
        msg.writeUInt(this.id);
        msg.writeUTF(path);
        this.send(msg);
    }

    receive(cmd, msg) {
        if (this.__back) {
            this.__back.call(this.__thisObj);
        }
        this.__back = this.__thisObj = null;
        this.dispose();
    }
}
//////////////////////////End File:remote/remotes/DeleteFileRemote.js///////////////////////////



})();
for(var key in remote) {
	flower[key] = remote[key];
}
