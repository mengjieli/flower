module test {
    export class TestUpdateUI extends flower.Group {
        private url:string = "res/uxml/Panel.xml";
        private content:string = "";
        private panel:flower.Group;

        public constructor() {
            super();
            this.percentWidth = 100;
            this.percentHeight = 100;

            this.load();
            test.DebugServer.socket.register(3005, this.receiveFileChange, this);
        }

        private load():void {
            //var load:flower.URLLoaderList = new flower.URLLoaderList(this.urls);
            //load.addListener(flower.Event.COMPLETE, this.onLoadComplete, this);
            //load.load();
            flower.UIParser.setLocalUIURL("PanelBackground", "res/uxml/PanelBackground.fxml");
            var parse = new flower.UIParser();
            parse.parseUIAsync("res/uxml/Panel.xml")
            parse.addListener(flower.Event.COMPLETE, this.onLoadComplete, this);
        }

        private onLoadComplete(e:flower.Event):void {
            this.panel = e.data;//(new flower.UIParser()).parseUI(e.data);
            this.addChild(this.panel);
            //this.content = (<flower.UIParser>e.currentTarget).className;
        }

        private receiveFileChange(cmd:number, msg:flower.VByteArray):void {
            var len = msg.readUInt();
            for (var i = 0; i < len; i++) {
                var url = msg.readUTF();
                var content = msg.readUTF();
                if (url == this.url) {
                    if (content != this.content) {
                        if (this.panel) {
                            this.panel.dispose();
                        }
                        trace("reload");
                        this.panel = (new flower.UIParser()).parseUI(content);
                        this.addChild(this.panel);
                        this.content = content;
                    }
                }
            }
        }
    }
}