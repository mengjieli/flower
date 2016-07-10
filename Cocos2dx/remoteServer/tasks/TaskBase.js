var TaskBase = (function () {

    function TaskBase(user, client, cmd, msg) {
        this.id = TaskBase.id++;
        this.user = user;
        this.client = client;
        this.cmd = cmd;
        this.remoteId = 0;
        if(msg) {
            this.msg = msg;
            this.msg.position = 0;
            this.msg.readUIntV();
            if(cmd >= 2000 && cmd < 3000) {
                this.remoteId = this.msg.readUIntV();
            }
        }
        if(this.user) {
            this.user.addTask(this);
        }
        this.startTask(cmd,msg);
    }

    var d = __define, c = TaskBase;
    p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {

    }

    /**
     * 执行任务
     * @param msg
     */
    p.excute = function(msg) {

    }

    /**
     * 任务执行失败
     * @param errorCode
     */
    p.fail = function (errorCode,message) {
        message = message||"";
        if(this.client) {
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
        if(this.user) {
            this.user.delTask(this.id);
        }
    }

    /**
     * 任务执行成功
     */
    p.success = function () {
        if(this.client) {
            var msg = new VByteArray();
            msg.writeUIntV(0);
            msg.writeUIntV(this.cmd);
            msg.writeUIntV(0);
            this.client.sendData(msg);
        }
        if(this.user) {
            this.user.delTask(this.id);
        }
    }

    /**
     * 发送消息给任务开始的客户端
     * @param bytes
     */
    p.sendData = function (bytes) {
        this.client.sendData(bytes);
    }

    /**
     * 关闭接收任务的客户端链接
     */
    p.close = function() {
        this.client.close();
    }

    TaskBase.id = 0;

    return TaskBase;
})();

global.TaskBase = TaskBase;