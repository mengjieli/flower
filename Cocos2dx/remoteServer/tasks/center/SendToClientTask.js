class SendToClientTask extends TaskBase {

    constructor(user, fromClient, cmd, msg) {
        super(user, fromClient, cmd, msg);
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    startTask(cmd, msg) {
        var id = msg.readUIntV();
        var client = Config.getClient(id);
        if (client) {
            var bytes = new VByteArray();
            var cmd = msg.readUIntV();
            bytes.writeUIntV(cmd);
            bytes.writeBytes(msg,msg.position,msg.length - msg.position);
            client.sendData(bytes);
        } else {
            this.fail(1030);
        }
    }
}