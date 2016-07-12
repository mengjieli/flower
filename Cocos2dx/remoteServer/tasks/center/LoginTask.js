class LoginTask extends TaskBase {

    constructor(user, fromClient, cmd, msg) {
        super(user, fromClient, cmd, msg);
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    startTask(cmd, msg) {
        msg.readUIntV();
        var client = this.client;
        var type = msg.readUTFV();
        console.log("[login]", type);
        if (type == "local") {
            var user = msg.readUTFV();
            var root = msg.readUTFV();
            var httpServerPort = msg.readUIntV();
            client.clientType = type;
            client.information = {
                id: client.id,
                ip: client.ip,
                httpServerPort:httpServerPort,
                user: user,
                root: root
            }
            client.hasLogin = true;
            this.success();
        } else if (type == "game") {
            var gameName = msg.readUTFV();
            client.clientType = type;
            client.information = {
                id: client.id,
                ip: client.ip,
                name: gameName
            };
            client.hasLogin = true;
            this.success();
        }
        Config.addClient(type, client);
    }
}