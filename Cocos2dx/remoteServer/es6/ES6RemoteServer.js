require("./com/requirecom");
require("./ftp/requireftp");
require("./net/requirenet");
require("./shell/requireshell");
//////////////////////////File:remoteServer/RemoteClient.js///////////////////////////
class RemoteClient extends WebSocketServerClient {
    constructor(connection, big) {
        super(connection, big);
    }

    receiveData(message) {
        var data;
        if (message.type == "utf8") {
            this.type = "utf8";
            data = JSON.parse(message.utf8Data);
        }
        else if (message.type == "binary") {
            var data = message.binaryData;
        }
        var bytes = new VByteArray();
        bytes.readFromArray(data);
        var cmd = bytes.readUIntV();
        switch (cmd) {
            case 0:
                //this.receiveHeart(bytes);
                return;
        }
        //if (this.hasLogin == false && (cmd != 0 && cmd != 1)) {
        //    this.sendFail(10, cmd, bytes);
        //    this.close();
        //    return;
        //}
        console.log(bytes.bytes);
        if (Config.cmds[cmd]) {
            console.log("[cmd]", cmd);
            var cls = global[Config.cmds[cmd]];
            if (cls == null) {
                this.sendFail(5, cmd, bytes);
            } else {
                try {
                    new cls(this.user, this, cmd, bytes);
                } catch (e) {
                    console.log(e);
                    this.sendFail(6, cmd, bytes, e);
                }
            }
        } else {
            this.sendFail(5, cmd, bytes);
        }
    }

    sendFail(errorCode, cmd, bytes, message) {
        message = message || "";
        var msg = new VByteArray();
        msg.writeUIntV(0);
        msg.writeUIntV(cmd);
        msg.writeUIntV(errorCode);
        msg.writeUTFV(message);
        bytes.position = 0;
        bytes.readUIntV();
        msg.writeBytes(bytes, bytes.position, bytes.length - bytes.position);
        this.sendData(msg);
    }

    receiveHeart(data) {
        var a = data.readUIntV();
        var b = data.readUIntV();
        var c = data.readUIntV();
        if (!a && !b && !c) {
            this.checkTime = (new Date()).getTime() + 30000;
        }
    }

    checkHeart(time) {
        //if (time > this.checkTime) {
        //    //console.log(time, this.checkTime);
        //    this.close();
        //}
    }

    receiveAnonce(data) {
        var msg = data.readUTFV();
        this.sendAllAnonce(msg);
    }

    sendAllAnonce(msg) {
        var bytes = new VByteArray();
        bytes.writeUIntV(201);
        bytes.writeUTFV(msg);
        this.server.sendDataToAll(bytes);
    }

    sendAnonce(msg) {
        var bytes = new VByteArray();
        bytes.writeUIntV(201);
        bytes.writeUTFV(msg);
        this.sendData(bytes);
    }

    sendData(bytes) {
        if (this.type == "binary") {
            this.connection.sendBytes(new Buffer(bytes.data));
        } else if (this.type == "utf8") {
            var str = "[";
            var array = bytes.data;
            for (var i = 0; i < array.length; i++) {
                str += array[i] + (i < array.length - 1 ? "," : "");
            }
            str += "]";
            this.connection.sendUTF(str);
        }
    }

    close() {
        console.log("close connection!");
        this.connection.close();
    }
}
//////////////////////////End File:remoteServer/RemoteClient.js///////////////////////////



//////////////////////////File:remoteServer/RemoteServer.js///////////////////////////
class RemoteServer extends WebSocketServer {

    constructor() {
        super(RemoteClient);


        var txt = (new File("./data/Command.json")).readContent();
        Config.cmds = JSON.parse(txt);
    }


    sendDataToAll(bytes) {
        for (var i = 0; i < this.clients.length; i++) {
            //this.clients[i].sendDataGameClient.js(bytes);
        }
    }
}

var serverPort = 9900;
//////////////////////////End File:remoteServer/RemoteServer.js///////////////////////////



//////////////////////////File:remoteServer/data/Config.js///////////////////////////
class Config {
    static cmds = [];
}
//////////////////////////End File:remoteServer/data/Config.js///////////////////////////



//////////////////////////File:remoteServer/tasks/Task.js///////////////////////////
var Task = (function () {

    function Task() {
    }

    var d = __define, c = Task;
    p = c.prototype;

    return Task;
})();

global.Task = Task;
//////////////////////////End File:remoteServer/tasks/Task.js///////////////////////////



//////////////////////////File:remoteServer/tasks/TaskBase.js///////////////////////////
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
//////////////////////////End File:remoteServer/tasks/TaskBase.js///////////////////////////



//////////////////////////File:remoteServer/tasks/TaskSample.js///////////////////////////
var TaskSample = (function (_super) {

    __extends(TaskSample, _super);

    function TaskSample(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = TaskSample;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {

    }

    return TaskSample;

})(TaskBase);

global.TaskSample = TaskSample;
//////////////////////////End File:remoteServer/tasks/TaskSample.js///////////////////////////



var server = new RemoteServer();
server.start(serverPort);
