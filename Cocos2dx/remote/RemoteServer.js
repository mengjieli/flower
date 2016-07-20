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
        var ui = new flower.UIParser();
        ui.parseUI(content);
        ui.addListener(flower.Event.COMPLETE, this.__serverInputComplete, this);
    }

    __serverInputComplete(e) {
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
        var ui = new flower.UIParser();
        ui.parseUI(content);
        ui.addListener(flower.Event.COMPLETE, this.__clientChooseComplete, this);
    }

    __clientChooseComplete(e) {
        var ui = e.data;
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

exports.RemoteServer = RemoteServer;