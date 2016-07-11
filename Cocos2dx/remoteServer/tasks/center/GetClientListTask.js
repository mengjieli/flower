class GetClientListTask extends TaskBase {

    constructor(user, fromClient, cmd, msg) {
        super(user, fromClient, cmd, msg);
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    startTask(cmd, msg) {
        var name = msg.readUTFV();
        var clients = Config.getClients(name);
        var bytes = new VByteArray();
        bytes.writeUIntV(clients.length);
        for (var i = 0; i < clients.length; i++) {
            bytes.writeUTFV(JSON.stringify(clients[i].information));
        }
        this.sendData(bytes);
        this.success();
    }
}