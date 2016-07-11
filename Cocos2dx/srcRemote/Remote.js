var remote = {};
(function(){
//////////////////////////File:remote/RemoteServer.js///////////////////////////
class RemoteServer extends flower.VBWebSocket {

    __readyBack;
    __config;

    constructor() {
        super();
    }

    start(readyBack) {
        this.__readyBack = readyBack;
        this.__config = flower.sys.config.remote;
        this.__showConnectPanel();
    }

    __showConnectPanel() {
        var content = `
        <f:Panel width="350" height="250" scaleMode="no_scale" xmlns:f="flower">
            <f:RectUI id="background" percentWidth="100" percentHeight="100" lineColor="0x333333" lineWidth="1"
                      fillColor="0xE7E7E7"/>
            <f:Group left="1" right="1" height="24" top="1">
                <f:RectUI id="titleBar" percentWidth="100" percentHeight="100" fillColor="0xc2c2c2"
                          touchBegin="this.startDrag();"/>
                <f:Image id="iconImage"/>
                <f:Label id="titleLabel" y="3" touchEnabled="false" text="链接 Remote 服务器" horizontalCenter="0" fontSize="16"
                         fontColor="0x252325"/>
            </f:Group>
            <f:Group id="container" left="1" right="1" top="25" bottom="50">
                <f:Label horizontalCenter="-60" verticalCenter="-25" text="服务器地址 : "/>
                <f:RectUI horizontalCenter="40" verticalCenter="-25" width="120" height="20"/>
                <f:Input id="serverInput" horizontalCenter="40" verticalCenter="-25" text="192.168.1.159" width="120" fontColor="0xff6666"/>
                <f:Label x="10" horizontalCenter="-60"  verticalCenter="25" text="服务器端口 : "/>
                <f:RectUI horizontalCenter="40" verticalCenter="25" width="120" height="20"/>
                <f:Input id="portInput" horizontalCenter="40" verticalCenter="25" text="9900" width="120" fontColor="0xff6666"/>
            </f:Group>
            <f:Group left="1" right="1" height="50" bottom="0">
                <f:Button id="confirmButton" horizontalCenter="0" bottom="10" width="60" height="30">
                    <f:RectUI percentWidth="100" percentHeight="100" lineColor="0x333333" lineWidth="1" fillColor.up="0xE7E7E7"
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

    onConnect() {
        super.onConnect();
        if (this.__readyBack) {
            this.__readyBack();
        }
        var msg = new flower.VByteArray();
        msg.writeUInt(1);
        msg.writeUTF("game");
        msg.writeUTF("paik");
        this.send(msg);
    }

    onError() {
        super.onConnect();
        this.__showConnectPanel();
    }

    onClose() {
        super.onConnect();
        this.__showConnectPanel();
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

    constructor() {
        
    }
}
remote.Remote = Remote;
//////////////////////////End File:remote/Remote.js///////////////////////////



//////////////////////////File:remote/File.js///////////////////////////
class File extends Remote {
    
    constructor() {
        super();
    }
}
remote.File = File;
//////////////////////////End File:remote/File.js///////////////////////////



//////////////////////////File:remote/Direction.js///////////////////////////
class Direction extends Remote {

    constructor() {
        super();
    }
}

remote.Direction = Direction;
//////////////////////////End File:remote/Direction.js///////////////////////////



})();
for(var key in remote) {
	flower[key] = remote[key];
}
