var SVNShell = function (svnurl, localdir, user, password) {
    if (localdir.charAt(localdir.length - 1) != "/") {
        localdir = localdir + "/";
    }
    this.svnurl = svnurl;
    this.localdir = localdir;
    var svnpath = "svndir/";
    this.localsvndir = this.localdir + svnpath;
    this.user = user;
    this.password = password;
    this.serverStart = false;
    this.projectdir = this.localdir + svnpath;
    this.lastVersion = 0;
}

SVNShell.prototype.getReady = function (complete, thisObj) {
    this.readyComplete = complete;
    this.readyThis = thisObj;
    if (!this.isExist()) {
        this.createLocalSVN(this.getReadyCreateSVNComplete, this);
    } else {
        this.getReadyCreateSVNComplete();
    }
}

SVNShell.prototype.getReadyCreateSVNComplete = function () {
    console.log("startSVN");
    this.startSVNServer();
    if (!this.hasCheckOut()) {
        this.checkOut(this.getReadyCheckOut, this);
    } else {
        this.getReadyCheckOut();
    }
}

SVNShell.prototype.getReadyCheckOut = function () {
    if (this.readyComplete) {
        this.readyComplete.apply(this.readyThis);
        this.readyComplete = null;
        this.readyThis = null;
    }
}

/**
 * 本地的 svn 目录是否存在
 */
SVNShell.prototype.isExist = function () {
    var file = new File(this.localdir + "conf/svnserve.conf");
    return file.isExist();
}

/**
 * 不存在则创建
 */
SVNShell.prototype.createLocalSVN = function (complete, thisObj) {
    var _this = this;
    var file = new File(this.localdir);
    if (!file.isExist()) {
        File.mkdirsSync(this.localdir);
    }
    new ShellCommand("svnadmin", ["create", this.localdir], function () {
        _this.createLocalSVNComplete();
        if (complete) {
            complete.apply(thisObj);
        }
    });
}

/**
 * 创建本地 svn 完成后
 */
SVNShell.prototype.createLocalSVNComplete = function () {
    //console.log("创建本地 svn 目录完毕，" + this.localdir + " -> " + this.svnurl);
    //console.log("初始化 svn 配置");
    var file = new File(this.localdir + "conf/svnserve.conf");
    var content = file.readContent();
    var index, str;
    var strs = ["# anon-access = read", "# auth-access = write", "# password-db = passwd", "# authz-db = authz"];
    for (var i = 0; i < strs.length; i++) {
        str = strs[i];
        var index = StringDo.findString(content, str, 0);
        content = content.slice(0, index) + str.slice(2, str.length) + content.slice(index + str.length, content.length);
    }
    file.save(content);

    console.log("写入用户名信息 conf/passwd");
    file = new File(this.localdir + "conf/passwd");
    content = file.readContent();
    content += "\n" + this.user + "=" + this.password;
    file.save(content);

    console.log("修改用户权限 conf/authz");
    file = new File(this.localdir + "conf/authz");
    content = file.readContent();
    content += "\n[/]\n" + this.user + "=rw";
    file.save(content);
}

/**
 * 启动 svn 服务器
 */
SVNShell.prototype.startSVNServer = function () {
    if (this.serverStart == false) {
        new ShellCommand("svnserve", ["-d", "-r", this.localdir], function () {
            this.serverStart = true;
        }, null);
    } else {
    }
}

/**
 * 是否 checkOut 过
 */
SVNShell.prototype.hasCheckOut = function () {
    var file = new File(this.projectdir);
    return file.isExist();
}

/**
 * checkOut 目录
 */
SVNShell.prototype.checkOut = function (complete, thisObj) {
    console.log("check out");
    new ShellCommand("svn", ["checkout", this.svnurl,
        "--username=" + this.user, "--password=" + this.password, this.projectdir], function () {
        //console.log("check out complete !");
        if (complete) {
            complete.apply(thisObj);
        }
    }, null, function (d) {
        console.log(d);

    }, null, function (e) {
        console.log(e);
    }, null);
}

/**
 * 更新版本
 * @param complete
 * @param thisObj
 */
SVNShell.prototype.update = function (complete, thisObj) {
    var content = "";
    var _this = this;
    new ShellCommand("svn", ["update", this.projectdir], function () {
        var start = StringDo.findString(content, "revision ", 0) + "revision ".length;
        var end = StringDo.findString(content, ".", start);
        _this.lastVersion = parseInt(content.slice(start, end));
        console.log("update content:", content);
        if (complete) {
            complete.apply(thisObj);
        }
    }, null, function (data) {
        content += data;
    }, null, function (data) {
        console.log("[svn update error]",data);
        //如果出错 cleanUp
        new ShellCommand("svn", ["cleanup", this.projectdir], function () {
            _this.update(complete, thisObj);
        });
    });
}

/**
 * 检查版本差异
 * @param v1
 * @param v2
 * @param complete
 * @param thisObj
 * @return Array<SVNDifference>
 */
SVNShell.prototype.checkVersionDifference = function (v1, v2, complete, thisObj) {
    var diffs = [];
    var content = "";
    var _this = this;
    new ShellCommand("svn", ["diff", "-r", v1 + ":" + v2, this.projectdir], function () {
        diffs = SVNDifference.changeStringToDifferences(content, _this);
        if (complete) {
            complete.apply(thisObj, [diffs]);
        }
    }, null, function (data) {
        content += data;
    });
}

global.SVNShell = SVNShell;