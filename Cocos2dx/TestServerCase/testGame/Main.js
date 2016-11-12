var fork = require('child_process').fork;
require("./../tools/com/requirecom");
require("./../tools/net/requirenet");

require("./ControlLogin");
require("./logic/Account");

var file = new File("./account.json");
var users = JSON.parse(file.readContent());

file = new File("./config.json");
var config = JSON.parse(file.readContent());


var threads = [];
var threadStarting = false;
var quitAll = false;
var log = {loginCount: 0};
var loginc = new ControlLogin(threads, config, log);

process.on('SIGINT', function () {
    quitAll = true;
    loginc.quit();
    for (var i = 0; i < threads.length; i++) {
        threads[i].kill();
    }
});

function Thread() {
    threadStarting = true;
    this.users = users.slice(threads.length * config.threadMaxUser, (threads.length + 1) * config.threadMaxUser);
    for (var i = 0; i < this.users.length; i++) {
        this.users[i].login = false;
    }
    var thread = fork("./logic/Account.js", []);
    thread.on('message', this.onMessage.bind(this));
    thread.send({"type": "config", "message": config});
    thread.send({"type": "users", "message": this.users});
    thread.send({"type": "start", "message": threads.length});
    this.thread = thread;
    this.isReady = false;
    this.isLogin = false;
    this.loginCount = 0;
    threads.push(this);
}

Thread.prototype.onMessage = function (msg) {
    //console.log("thread ready,", threads.length, Thread.max);
    var type = msg.type;
    if (type == "ready") {
        threadStarting = false;
        startThread(Thread.max);
        this.isReady = true;
    } else if (type == "quit") {
        this.thread.kill();
        isQuit = false;
        for (var i = 0; i < threads.length; i++) {
            if (threads[i] == this) {
                threads.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < this.users.length; i++) {
            this.users[i].login = false;
        }
        reduceThread();
    } else if (type == "loginAccountComplete") {
        this.loginUserComplete(msg.account);
    } else if (type == "userLoginOut") {
        this.userLoginOut(msg.account);
    } else if (type == "SIGINT") {
        console.log("thread quit!!!!!")
    } else if (type == "notLoginning") {
        this.isLogin = false;
        loginc.onLoginningOut(this,msg.account);
    }
}

Thread.prototype.kill = function () {
    this.thread.send({"type": "kill"});
    this.thread.kill();
}

Thread.prototype.quit = function () {
    isQuit = true;
    this.thread.send({"type": "quit"});
}

Thread.prototype.loginUser = function () {
    if (this.isLogin) {
        return;
    }
    this.isLogin = true;
    this.thread.send({"type": "login"});
}

Thread.prototype.loginUserComplete = function (account) {
    for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].user == account) {
            this.users[i].login = true;
            break;
        }
    }
    this.loginCount++;
    this.isLogin = false;
    loginc.onUserLogin(this, account);
}

Thread.prototype.userLoginOut = function (account) {
    for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].user == account) {
            this.users[i].login = false;
            break;
        }
    }
    this.loginCount--;
    loginc.onUserLoginOut(this, account);
}

function startThread(count) {
    if (threadStarting || count > config.maxThread) {
        return;
    }
    Thread.max = count;
    //console.log(threads.length, count);
    if (threads.length < count) {
        new Thread();
    }
}

function updateConfig() {
    if (quitAll) {
        return;
    }
    printLog();
    var file = new File("./config.json");
    var cfg = JSON.parse(file.readContent());
    config.thread = cfg.thread;
    config.loginCount = cfg.loginCount;
    config.threadUser = cfg.threadUser;
    config.loginSpeed = cfg.loginSpeed;
    if (config.thread > threads.length) {
        startThread(config.thread);
    }
    if (config.thread < threads.length) {
        reduceThread();
    }
    setTimeout(updateConfig, 1000);
}

function printLog() {
    //console.log(log);
    var date = new Date();
    var file = new File("./log/" + date.getFullYear() + "_" + (date.getMonth() + 1) + "_" + date.getDate() + "_" + date.getHours());
    var content = "";
    if (file.isExist()) {
        content += file.readContent();
    }
    content += date.getTime() + " " + log.loginCount + "\n";
    //console.log(content,"\n\n");
    file.save(content);
}

var isQuit = false;
function reduceThread() {
    if (isQuit) {
        return;
    }
    if (config.thread < threads.length && threads.length) {
        threads[threads.length - 1].quit();
    }
}

startThread(config.thread);
setTimeout(updateConfig, 1000);