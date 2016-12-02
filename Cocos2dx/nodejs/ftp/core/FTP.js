var path = require('path');
var fs = require('fs');
var Client = require('ftp');
var Promise = require('bluebird');

/**
 * 初始化 ftp 客户端
 * @param host ip 地址
 * @param user 用户名
 * @param password 密码
 * @constructor
 */
global.FTP = function (host, user, password) {
    this.client = null;
    this.host = host;
    this.user = user;
    this.password = password;
    this.isconnect = false;
}

global.__define(global.FTP.prototype, "hasConnect"
    , function () {
        return this.isconnect;
    }
    , function (val) {
    }
);

/**
 * 链接服务器
 * @param connectBack
 * @param thisObj
 * @param args
 */
global.FTP.prototype.connect = function (connectBack, thisObj, args) {
    if (!this.client) {
        this.client = new Client();
        var _this = this;
        this.client.on("ready", function () {
            _this.isconnect = true;
            if (connectBack) {
                connectBack.apply(thisObj, args);
            }
        });
    }
    this.client.connect({
        host: this.host,
        user: this.user,
        password: this.password
    });
}

/**
 * 上传本地的文件到 ftp 服务器中
 * @param files File 的数组 必须参数 {url:"./192/update1.zip",name::"update1",end:"zip"}
 * @param ftpDir
 * @param complete
 * @param thisObj
 */
global.FTP.prototype.uploadToDirection = function (files, ftpDir, complete, thisObj) {
    while (ftpDir.charAt(ftpDir.length - 1) == "/") {
        ftpDir = ftpDir.slice(0, ftpDir.length - 1);
    }
    var index = 0;
    var uploadNext = function () {
        if (index >= files.length) {
            if (complete) {
                complete.apply(thisObj);
            }
            return;
        }
        var file = files[index];
        index++;
        console.log("upload ", file.url, "->", ftpDir + "/" + file.name + "." + file.end);
        this.upload(file.url, ftpDir + "/" + file.name + "." + file.end, uploadNext, this);
    }
    uploadNext.apply(this);
}

/**
 * 上传文件
 * @param file 本地文件
 * @param ftpurl ftp 上的目录
 * @param complete 完成回调
 * @param thisObj 完成回调 this 指针
 */
global.FTP.prototype.upload = function (file, ftpurl, complete, thisObj, tryTime) {
    if (!this.isconnect) {
        this.connect(this.upload, this, arguments);
        return;
    }
    tryTime = tryTime || 10;
    var urls = ftpurl.split("/");
    var dir = "";
    for (var i = 0; i < urls.length - 1; i++) {
        dir += urls[i] + "/";
    }
    this.mkdir(dir, function () {
        var client = this.client;
        var _this = this;
        var putComplete = function (err) {
            if (delayCall) {
                delayCall.dispose();
            }
            if (err) {
                console.log(err);
                console.log(file, " -> ", ftpurl);
                retryPut();
            } else {
                _this.close();
                if (complete) {
                    complete.apply(thisObj);
                }
            }
        };
        var putTimeOut = function () {
            if (delayCall) {
                delayCall.dispose();
                delayCall = null;
            }
            _this.abort(function () {
                retryPut();
            });
            client.logout(function () {
                retryPut();
            });
        }
        var retryPut = function () {
            if (delayCall) {
                delayCall.dispose();
                delayCall = null;
            }
            _this.close();
            tryTime--;
            if (tryTime == 0) {
                _this.end();
                console.log("upload error :", ftpurl);
                return;
            }
            console.log("try upload :", ftpurl, "tryTime:", tryTime);
            _this.upload(file, ftpurl, complete, thisObj, tryTime);
        }
        var delayCall;// = new DelayCall(3000, putTimeOut);
        client.put(file, ftpurl, putComplete, retryPut);
    }, this);
}

global.FTP.prototype.del = function (ftpurl, complete, thisObj) {
    if (!this.isconnect) {
        this.connect(this.del, this, arguments);
        return;
    }
    var client = this.client;
    var _this = this;
    this.isExist(ftpurl, function (bool) {
        if (bool) {
            client.rmdir(ftpurl, function (err) {
                _this.close();
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    if (complete) {
                        complete.apply(thisObj);
                    }
                }
            });
        } else {
            if (complete) {
                complete.apply(thisObj);
            }
        }
    }, this);
}

global.FTP.prototype.list = function (ftpurl, complete, thisObj) {
    if (!this.isconnect) {
        this.connect(this.list, this, arguments);
        return;
    }
    var client = this.client;
    var _this = this;
    client.list(ftpurl, function (code, list) {
        complete.call(thisObj, list);
    });
}

/**
 * 创建目录
 * @param ftpurl
 * @param complete
 * @param thisObj
 */
global.FTP.prototype.mkdir = function (ftpurl, complete, thisObj) {
    if (!this.isconnect) {
        this.connect(this.mkdir, this, arguments);
        return;
    }
    while (ftpurl.charAt(ftpurl.length - 1) == "/") {
        ftpurl = ftpurl.slice(0, ftpurl.length - 1);
    }
    var client = this.client;
    var _this = this;
    var urlArray = ftpurl.split("/");
    var url = "";
    var index = 0;
    var func = function (list) {
        var find = false;
        var findURL = "";
        for (var i = 0; i < list.length; i++) {
            if (list[i].name == urlArray[index]) {
                find = true;
                break;
            }
        }
        url += (index == 0 ? "" : "/") + urlArray[index];
        if (find == false) {
            client.mkdir(url, mkdirComplete);
            return;
        }
        mkdirComplete();
    };
    var mkdirComplete = function (error, dir, state) {
        index++;
        if (index == urlArray.length) {
            complete.call(thisObj);
            return;
        }
        _this.list(url, func);
    }
    this.list(url, func);
}

/**
 * 判断目录或文件是否存在
 * @param ftpurl
 * @param complete
 * @param thisObj
 */
global.FTP.prototype.isExist = function (ftpurl, complete, thisObj) {
    if (!this.isconnect) {
        this.connect(this.isExist, this, arguments);
        return;
    }
    while (ftpurl.charAt(ftpurl.length - 1) == "/") {
        ftpurl = ftpurl.slice(0, ftpurl.length - 1);
    }
    var client = this.client;
    var _this = this;
    var urlArray = ftpurl.split("/");
    var url = "";
    var index = 0;
    var func = function (list) {
        var find = false;
        for (var i = 0; i < list.length; i++) {
            if (list[i].name == urlArray[index]) {
                find = true;
                break;
            }
        }
        if (find == false) {
            _this.close();
            complete.call(thisObj, false);
            return false;
        }
        url += (index == 0 ? "" : "/") + urlArray[index];
        index++;
        if (index == urlArray.length) {
            _this.close();
            complete.call(thisObj, true);
            return true;
        }
        _this.list(url, func);
    };
    this.list(url, func);
}

global.FTP.prototype.printAPI = function () {
    if (!this.isconnect) {
        this.connect(this.printAPI, this, arguments);
        return;
    }
    var client = this.client;
    for (key in client) {
        console.log(key);
    }
}

global.FTP.prototype.abort = function (func, thisObj) {
    if (!this.isconnect) {
        if (func) {
            func.apply(thisObj);
        }
        return;
    }
    var client = this.client;
    client.abort(function () {
        if (func) {
            func.apply(thisObj);
        }
    });
}

global.FTP.prototype.close = function () {
    this.client.destroy();
    this.client = null;
    this.isconnect = false;
}