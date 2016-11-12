var LoginGame = (function (_super) {

    __extends(LoginGame, _super);

    function LoginGame(data, net, dispatcher, id) {
        _super.call(this);
        this.data = data;
        this.net = net;
        this.dispatcher = dispatcher;

        this.id = LoginGame.id++ + id * 1000000;


        dispatcher.addEventListener(299, this.loginBack, this);

        this.login();
    }

    var d = __define, c = LoginGame;
    var p = c.prototype;

    p.login = function () {
        //console.log(" start login game " + this.id);
        //uint        platformId      // 登录类型，以后需要使用第三方账号登录时表示平台 id
        //string      loginName       // 登录名或开放 id
        //string      loginToken      // 密码或登录令牌，不需要的时候置空
        var data = this.data;
        var msg = new VByteArray();
        msg.writeUIntV(200);
        msg.writeUIntV(8500);
        msg.writeUTFV(data.user);
        msg.writeUTFV(data.token);
        this.net.sendData(msg);
    }

    p.loginBack = function (e) {
        this.dispatcher.removeEventListener(299, this.loginBack, this);
        //console.log(" login game ok " + this.id);
        var msg = e.data.msg;
        this.data.login = true;
        this.data.id = msg.readUTFV();
        this.data.nick = msg.readUTFV();
        //console.log("login user ",this.data.user);

        this.dispatcher.dispatchEvent(new Event("loginGameComplete"));
    }

    return LoginGame;

})(EventDispatcher);

LoginGame.id = 0;

global.LoginGame = LoginGame;