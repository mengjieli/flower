function ControlLogin(threads, config, log) {
    this.threads = threads;
    this.config = config;
    this.log = log;
    this.loginCount = 0;
    this.loginingCount = 0;
    this.secondLogin = 0;
    this.secondLogining = 0;
    this.over = false;
    this.isChecking = false;
    this.update();
}

ControlLogin.prototype.update = function () {
    if (this.over) {
        return;
    }
    this.secondNeedLogin = this.config.loginSpeed;
    this.secondLogin = 0;
    this.secondLogining = 0;
    this.checkLogin();
    setTimeout(this.update.bind(this), 1000);
}

ControlLogin.prototype.checkLogin = function () {
    var find = true;
    var config = this.config;
    this.isChecking = true;
    //console.log(this.loginCount,this.loginingCount,config.loginCount,this.secondLogin ,this.secondLogining,this.secondNeedLogin);
    while (this.loginCount + this.loginingCount < config.loginCount && this.secondLogin + this.secondLogining <= this.secondNeedLogin && find) {
        //console.log("has login count");
        find = false;
        var list = [];
        for (var i = 0; i < this.threads.length; i++) {
            if (!this.threads[i].isLogin && this.threads[i].loginCount < config.threadMaxUser && this.threads[i].loginCount < config.threadUser) {
                list.push(this.threads[i]);
            }
        }
        if (list.length) {
            find = true;
            list.sort(function (a, b) {
                return a.loginCount < b.loginCount ? true : false;
            });
            list[list.length - 1].loginUser();
            //console.log("user login~~~",this.loginingCount)
            this.secondLogining++;
            this.loginingCount++;
        }
        //if(!find) {
        //    console.log("no find,all thread is loginning!");
        //}
    }
    this.log.loginCount = this.loginCount;
    this.isChecking = false;
}

ControlLogin.prototype.onUserLogin = function (thread, account) {
    this.secondLogining--;
    this.secondLogin++;
    this.loginCount++;
    this.loginingCount--;
    //console.log("!login",this.loginingCount)
    if (this.secondLogin < this.secondNeedLogin && !this.isChecking) {
        this.checkLogin();
    }
}

ControlLogin.prototype.onLoginningOut = function(thread,account) {
    //console.log("???onLoginningOut")
    this.loginingCount--;
}

ControlLogin.prototype.onUserLoginOut = function (thread, account) {
    this.loginCount--;
}

ControlLogin.prototype.updateConfig = function (config) {
    this.config = config;
}

ControlLogin.prototype.quit = function () {
    this.over = true;
}

global.ControlLogin = ControlLogin;