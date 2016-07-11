class Main {
    socket;

    constructor() {
        flower.start(this.ready.bind(this));
    }

    ready() {
        //var socket = new flower.VBWebSocket(true);
        //this.socket = socket;
        //socket.connect("192.168.1.159", 9900);
        //socket.addListener(flower.Event.CONNECT, this.onConnect, this);
        //socket.register(102, this.onReceive, this);
        //return;
        new Test();

        //var ui = new flower.UIParser();
        //ui.parseUIAsync("res/test/Server.xml");
        //flower.Stage.getInstance().addChild(ui);


        flower.Stage.getInstance().backgroundColor = 0xf6f6f6;
        var theme = new flower.Theme("res/theme/theme.json");
        theme.load();
        theme.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
    }

    loadThemeComplete(e) {
        //Alert.show("测试啊");
        var ui = new flower.UIParser();
        ui.parseUIAsync("res/test/TestTree.xml");
        flower.Stage.getInstance().addChild(ui);
    }

    onReceive(cmd, bytes) {
        flower.trace(bytes.readBoolean());
    }

    onConnect(e) {
        flower.trace(e.type);
        var msg = new flower.VByteArray();
        msg.writeUInt(101);
        msg.writeUTF("com1");
        this.socket.send(msg);
    }
}