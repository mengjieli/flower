class TaskBase {
    id;
    user;
    client;
    cmd;
    remoteId;

    constructor(user, client, cmd, msg) {
        this.id = TaskBase.id++;
        this.user = user;
        this.client = client;
        this.cmd = cmd;
        this.remoteId = 0;
        if (msg) {
            this.msg = msg;
            this.msg.position = 0;
            this.msg.readUIntV();
            if (cmd >= 2000 && cmd < 3000) {
                this.remoteId = this.msg.readUIntV();
            }
        }
        if (this.user) {
            this.user.addTask(this);
        }
        this.startTask(cmd, msg);
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    startTask(cmd, msg) {

    }

    /**
     * 执行任务
     * @param msg
     */
    excute(msg) {

    }

    /**
     * 任务执行失败
     * @param errorCode
     */
    fail(errorCode, message) {
        message = message || "";
        if (this.client) {
            var msg = new VByteArray();
            msg.writeUIntV(0);
            msg.writeUIntV(this.cmd);
            msg.writeUIntV(errorCode);
            msg.writeUTFV(message);
            this.msg.position = 0;
            this.msg.readUIntV();
            msg.writeBytes(this.msg, this.msg.position, this.msg.length - this.msg.position);
            this.client.sendData(msg);
        }
        if (this.user) {
            this.user.delTask(this.id);
        }
    }

    /**
     * 任务执行成功
     */
    success() {
        if (this.client) {
            var msg = new VByteArray();
            msg.writeUIntV(0);
            msg.writeUIntV(this.cmd);
            msg.writeUIntV(0);
            this.client.sendData(msg);
        }
        if (this.user) {
            this.user.delTask(this.id);
        }
    }

    /**
     * 发送消息给任务开始的客户端
     * @param bytes
     */
    sendData(bytes) {
        this.client.sendData(bytes);
    }

    /**
     * 关闭接收任务的客户端链接
     */
    close() {
        this.client.close();
    }

    static id = 0;
}