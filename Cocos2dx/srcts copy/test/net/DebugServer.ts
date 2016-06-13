module test {
    export class DebugServer {

        public static socket:flower.VBWebSocket = new flower.VBWebSocket(false);

        public constructor() {
            var socket = DebugServer.socket;
            socket.connect("192.168.0.112", 16501);
            socket.addListener(flower.Event.CONNECT, this.onConnect, this);
        }

        private onConnect(e:flower.Event):void {
            var msg = new flower.VByteArray();
            msg.writeUInt(1);
            msg.writeUTF("Cocos2dxGame");
            msg.writeUTF("limengjie");
            msg.writeUTF("limengjie");
            DebugServer.socket.send(msg);
        }
    }
}