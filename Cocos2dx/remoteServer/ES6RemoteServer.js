"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require("./com/requirecom");
require("./ftp/requireftp");
require("./net/requirenet");
require("./shell/requireshell");
//////////////////////////File:remoteServer/RemoteClient.js///////////////////////////

var RemoteClient = function (_WebSocketServerClien) {
    _inherits(RemoteClient, _WebSocketServerClien);

    function RemoteClient(connection, big) {
        _classCallCheck(this, RemoteClient);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RemoteClient).call(this, connection, big));

        _this.id = RemoteClient.id++;
        _this.hasLogin = false;
        _this.ip = connection.remoteAddress;
        while (true) {
            var code = _this.ip.charCodeAt(0);
            if (code < 48 || code > 57) {
                _this.ip = _this.ip.slice(1, _this.ip.length);
            } else {
                break;
            }
        }
        if (_this.ip == "127.0.0.1") {
            _this.ip = System.IP;
        }
        _this.information = {};
        return _this;
    }

    _createClass(RemoteClient, [{
        key: "receiveData",
        value: function receiveData(message) {
            var data;
            if (message.type == "utf8") {
                this.type = message.type;
                data = JSON.parse(message.utf8Data);
            } else if (message.type == "binary") {
                this.type = message.type;
                var data = message.binaryData;
            }
            var bytes = new VByteArray();
            bytes.readFromArray(data);
            var cmd = bytes.readUIntV();
            //console.log(cmd, this.hasLogin, " [bytes] ", bytes.bytes);
            switch (cmd) {
                case 0:
                    //this.receiveHeart(bytes);
                    return;
            }
            if (this.hasLogin == false && cmd != 0 && cmd != 1) {
                this.sendFail(10, cmd, bytes);
                this.close();
                return;
            }
            if (Config.cmds[cmd]) {
                var className = Config.cmds[cmd];
                //console.log(className);
                var cls = eval(className);
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
    }, {
        key: "sendFail",
        value: function sendFail(errorCode, cmd, bytes, message) {
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
    }, {
        key: "receiveHeart",
        value: function receiveHeart(data) {
            var a = data.readUIntV();
            var b = data.readUIntV();
            var c = data.readUIntV();
            if (!a && !b && !c) {
                this.checkTime = new Date().getTime() + 30000;
            }
        }
    }, {
        key: "checkHeart",
        value: function checkHeart(time) {
            //if (time > this.checkTime) {
            //    //console.log(time, this.checkTime);
            //    this.close();
            //}
        }
    }, {
        key: "receiveAnonce",
        value: function receiveAnonce(data) {
            var msg = data.readUTFV();
            this.sendAllAnonce(msg);
        }
    }, {
        key: "sendAllAnonce",
        value: function sendAllAnonce(msg) {
            var bytes = new VByteArray();
            bytes.writeUIntV(201);
            bytes.writeUTFV(msg);
            this.server.sendDataToAll(bytes);
        }
    }, {
        key: "sendAnonce",
        value: function sendAnonce(msg) {
            var bytes = new VByteArray();
            bytes.writeUIntV(201);
            bytes.writeUTFV(msg);
            this.sendData(bytes);
        }
    }, {
        key: "sendData",
        value: function sendData(bytes) {
            if (this.type == "binary") {
                this.connection.sendBytes(new Buffer(bytes.data));
            } else {
                var str = "[";
                var array = bytes.data;
                for (var i = 0; i < array.length; i++) {
                    str += array[i] + (i < array.length - 1 ? "," : "");
                }
                str += "]";
                this.connection.sendUTF(str);
            }
        }
    }, {
        key: "close",
        value: function close() {
            this.connection.close();
        }
    }, {
        key: "onClose",
        value: function onClose() {
            Config.removeClient(this.clientType, this);
            _get(Object.getPrototypeOf(RemoteClient.prototype), "onClose", this).call(this);
        }
    }]);

    return RemoteClient;
}(WebSocketServerClient);
//////////////////////////End File:remoteServer/RemoteClient.js///////////////////////////

//////////////////////////File:remoteServer/RemoteServer.js///////////////////////////


RemoteClient.id = 1;

var RemoteServer = function (_WebSocketServer) {
    _inherits(RemoteServer, _WebSocketServer);

    function RemoteServer() {
        _classCallCheck(this, RemoteServer);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(RemoteServer).call(this, RemoteClient));

        var txt = new File("./data/Command.json").readContent();
        Config.cmds = JSON.parse(txt);
        return _this2;
    }

    _createClass(RemoteServer, [{
        key: "sendDataToAll",
        value: function sendDataToAll(bytes) {
            for (var i = 0; i < this.clients.length; i++) {
                //this.clients[i].sendDataGameClient.js(bytes);
            }
        }
    }]);

    return RemoteServer;
}(WebSocketServer);

var serverPort = 9900;
var httpPort = 19999;
//////////////////////////End File:remoteServer/RemoteServer.js///////////////////////////

//////////////////////////File:remoteServer/data/Config.js///////////////////////////

var Config = function () {
    function Config() {
        _classCallCheck(this, Config);
    }

    _createClass(Config, null, [{
        key: "addClient",
        value: function addClient(name, client) {
            if (!Config.clients[name]) {
                Config.clients[name] = [];
            }
            Config.clients[name].push(client);
        }
    }, {
        key: "removeClient",
        value: function removeClient(name, client) {
            var list = Config.clients[name];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] == client) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }, {
        key: "getClients",
        value: function getClients(name) {
            return Config.clients[name] || [];
        }
    }, {
        key: "getClient",
        value: function getClient(id) {
            for (var key in Config.clients) {
                var list = Config.clients[key];
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].id == id) {
                            return list[i];
                        }
                    }
                }
            }
            return null;
        }
    }]);

    return Config;
}();
//////////////////////////End File:remoteServer/data/Config.js///////////////////////////

//////////////////////////File:remoteServer/tasks/Task.js///////////////////////////


Config.cmds = [];
Config.clients = {};

var Task = function Task() {
    _classCallCheck(this, Task);
};
//////////////////////////End File:remoteServer/tasks/Task.js///////////////////////////

//////////////////////////File:remoteServer/tasks/TaskBase.js///////////////////////////


var TaskBase = function () {
    function TaskBase(user, client, cmd, msg) {
        _classCallCheck(this, TaskBase);

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


    _createClass(TaskBase, [{
        key: "startTask",
        value: function startTask(cmd, msg) {}

        /**
         * 执行任务
         * @param msg
         */

    }, {
        key: "excute",
        value: function excute(msg) {}

        /**
         * 任务执行失败
         * @param errorCode
         */

    }, {
        key: "fail",
        value: function fail(errorCode, message) {
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

    }, {
        key: "success",
        value: function success() {
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

    }, {
        key: "sendData",
        value: function sendData(bytes) {
            this.client.sendData(bytes);
        }

        /**
         * 关闭接收任务的客户端链接
         */

    }, {
        key: "close",
        value: function close() {
            this.client.close();
        }
    }]);

    return TaskBase;
}();
//////////////////////////End File:remoteServer/tasks/TaskBase.js///////////////////////////

//////////////////////////File:remoteServer/tasks/TaskSample.js///////////////////////////


TaskBase.id = 0;

var TaskSample = function (_TaskBase) {
    _inherits(TaskSample, _TaskBase);

    function TaskSample(user, fromClient, cmd, msg) {
        _classCallCheck(this, TaskSample);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TaskSample).call(this, user, fromClient, cmd, msg));
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */


    _createClass(TaskSample, [{
        key: "startTask",
        value: function startTask(cmd, msg) {}
    }]);

    return TaskSample;
}(TaskBase);
//////////////////////////End File:remoteServer/tasks/TaskSample.js///////////////////////////

//////////////////////////File:remoteServer/tasks/center/ExcuteTask.js///////////////////////////


var ExcuteTask = function (_TaskBase2) {
    _inherits(ExcuteTask, _TaskBase2);

    function ExcuteTask(user, fromClient, cmd, msg) {
        _classCallCheck(this, ExcuteTask);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ExcuteTask).call(this, user, fromClient, cmd, msg));
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */


    _createClass(ExcuteTask, [{
        key: "startTask",
        value: function startTask(cmd, msg) {
            var taskId = msg.readUIntV();
            //console.log("excute task back",taskId);
            if (this.user) {
                this.user.excuteTask(taskId, msg);
            } else {
                var list = User.list;
                for (var i = 0; i < list.length; i++) {
                    var user = list[i];
                    if (user.excuteTask(taskId, msg) == true) {
                        break;
                    }
                }
            }
            this.success();
        }
    }]);

    return ExcuteTask;
}(TaskBase);
//////////////////////////End File:remoteServer/tasks/center/ExcuteTask.js///////////////////////////

//////////////////////////File:remoteServer/tasks/center/GetClientListTask.js///////////////////////////


var GetClientListTask = function (_TaskBase3) {
    _inherits(GetClientListTask, _TaskBase3);

    function GetClientListTask(user, fromClient, cmd, msg) {
        _classCallCheck(this, GetClientListTask);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(GetClientListTask).call(this, user, fromClient, cmd, msg));
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */


    _createClass(GetClientListTask, [{
        key: "startTask",
        value: function startTask(cmd, msg) {
            var remoteId = msg.readUIntV();
            var name = msg.readUTFV();
            var clients = Config.getClients(name);
            var bytes = new VByteArray();
            bytes.writeUIntV(this.cmd + 1);
            bytes.writeUIntV(remoteId);
            bytes.writeUIntV(clients.length);
            for (var i = 0; i < clients.length; i++) {
                bytes.writeUTFV(JSON.stringify(clients[i].information));
            }
            this.sendData(bytes);
            this.success();
        }
    }]);

    return GetClientListTask;
}(TaskBase);
//////////////////////////End File:remoteServer/tasks/center/GetClientListTask.js///////////////////////////

//////////////////////////File:remoteServer/tasks/center/LoginTask.js///////////////////////////


var LoginTask = function (_TaskBase4) {
    _inherits(LoginTask, _TaskBase4);

    function LoginTask(user, fromClient, cmd, msg) {
        _classCallCheck(this, LoginTask);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(LoginTask).call(this, user, fromClient, cmd, msg));
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */


    _createClass(LoginTask, [{
        key: "startTask",
        value: function startTask(cmd, msg) {
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
                    httpServerPort: httpServerPort,
                    user: user,
                    root: root
                };
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
    }]);

    return LoginTask;
}(TaskBase);
//////////////////////////End File:remoteServer/tasks/center/LoginTask.js///////////////////////////

//////////////////////////File:remoteServer/tasks/center/SendToClientTask.js///////////////////////////


var SendToClientTask = function (_TaskBase5) {
    _inherits(SendToClientTask, _TaskBase5);

    function SendToClientTask(user, fromClient, cmd, msg) {
        _classCallCheck(this, SendToClientTask);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SendToClientTask).call(this, user, fromClient, cmd, msg));
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */


    _createClass(SendToClientTask, [{
        key: "startTask",
        value: function startTask(cmd, msg) {
            var id = msg.readUIntV();
            var client = Config.getClient(id);
            if (client) {
                var bytes = new VByteArray();
                var cmd = msg.readUIntV();
                bytes.writeUIntV(cmd);
                bytes.writeBytes(msg, msg.position, msg.length - msg.position);
                client.sendData(bytes);
            } else {
                this.fail(1030);
            }
        }
    }]);

    return SendToClientTask;
}(TaskBase);
//////////////////////////End File:remoteServer/tasks/center/SendToClientTask.js///////////////////////////

//////////////////////////File:remoteServer/tasks/center/TransformTask.js///////////////////////////


var TransformTask = function (_TaskBase6) {
    _inherits(TransformTask, _TaskBase6);

    function TransformTask(user, fromClient, cmd, msg) {
        _classCallCheck(this, TransformTask);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TransformTask).call(this, user, fromClient, cmd, msg));
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */


    _createClass(TransformTask, [{
        key: "startTask",
        value: function startTask(cmd, msg) {
            var id = msg.readUIntV();
            var client = Config.getClient(id);
            if (client) {
                var bytes = new VByteArray();
                var cmd = msg.readUIntV();
                bytes.writeUIntV(cmd);
                bytes.writeUIntV(this.client.id);
                bytes.writeBytes(msg, msg.position, msg.length - msg.position);
                client.sendData(bytes);
            } else {
                this.fail(1030);
            }
        }
    }]);

    return TransformTask;
}(TaskBase);
//////////////////////////End File:remoteServer/tasks/center/TransformTask.js///////////////////////////

//////////////////////////File:remoteServer/tasks/qaTest/GetQATestAccountTask.js///////////////////////////


var GetQATestAccountTask = function (_TaskBase7) {
    _inherits(GetQATestAccountTask, _TaskBase7);

    function GetQATestAccountTask(user, fromClient, cmd, msg) {
        _classCallCheck(this, GetQATestAccountTask);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(GetQATestAccountTask).call(this, user, fromClient, cmd, msg));
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */


    _createClass(GetQATestAccountTask, [{
        key: "startTask",
        value: function startTask(cmd, msg) {
            if (!GetQATestAccountTask.config) {
                GetQATestAccountTask.config = JSON.parse(new File("./data/qaTest/config.json").readContent());
            }
            if (!GetQATestAccountTask.accounts) {
                var file = new File("./data/qaTest/account.json");
                var content = file.readContent();
                GetQATestAccountTask.accounts = JSON.parse(content);
            }
            var accounts = GetQATestAccountTask.accounts;
            var index = GetQATestAccountTask.index;
            var remoteId = msg.readUIntV();
            var len = GetQATestAccountTask.config.userAccount;
            while (len >= 0) {
                var num = 100;
                if (len == 0) {
                    len = -1;
                    num = 0;
                } else {
                    if (len > num) {
                        len -= num;
                    } else {
                        num = len;
                        len = 0;
                    }
                }
                var bytes = new VByteArray();
                bytes.writeUIntV(this.cmd + 1);
                bytes.writeUIntV(remoteId);
                bytes.writeUIntV(num);
                for (var i = 0; i < num; i++, index++) {
                    bytes.writeUTFV(accounts[index].user);
                    bytes.writeUTFV(accounts[index].password);
                }
                this.sendData(bytes);
            }
            GetQATestAccountTask.index = index;
            this.success();
        }
    }]);

    return GetQATestAccountTask;
}(TaskBase);
//////////////////////////End File:remoteServer/tasks/qaTest/GetQATestAccountTask.js///////////////////////////

GetQATestAccountTask.index = 0;
var server = new RemoteServer();
server.start(serverPort);