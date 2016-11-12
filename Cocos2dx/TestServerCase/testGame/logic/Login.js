var Login = (function (_super) {

    __extends(Login, _super);

    function Login(user, password, httpIp, gameIp) {
        _super.call(this);

        this.user = user;
        this.password = password;
        this.httpIp = httpIp;
        this.gameIp = gameIp;

        this.checkLogin();

    }

    var d = __define, c = Login;
    var p = c.prototype;

    p.checkLogin = function () {
        //http://主机名:13215/empery/account/promotion/check_login?loginName=abc&password=def&token=token
        this.token = this.getToken();
        var request = new HttpRequest(this.httpIp, 13215, "/empery/account/promotion/check_login?" +
            "loginName=" + this.user + "&password=" + this.password + "&token=" + this.token);
        request.get({}, "GET");
        //console.log("http://" + this.httpIp + ":13215" + "/empery/account/promotion/check_login?" +
        //    "loginName=" + this.user + "&password=" + this.password + "&token=" + this.token);
        request.addEventListener(Event.CLOSE, function (e) {
            //console.log("login back1", request.data)
            try {
                var config = JSON.parse(request.data);
                var active = config.hasBeenActivated;
                if (active == false) {
                    this.active();
                } else {
                    this.checkLoginComplete();
                }
            } catch (e) {
                setTimeout(this.checkLogin.bind(this), 500);
            }
        }, this);
    }

    p.active = function () {
        var request = new HttpRequest(this.httpIp, 13215, "/empery/account/promotion/activate?" +
            "loginName=" + this.user + "&initialNick=" + this.user);
        request.get({}, "GET");
        //console.log("login 2")
        request.addEventListener(Event.CLOSE, function (e) {
            //console.log("login back2")
            try {
                var config = JSON.parse(request.data);
            } catch (e) {
                setTimeout(this.active.bind(this), 500);
            }
            //console.log(config);
            this.checkLoginComplete();
        }, this);
    }

    p.checkLoginComplete = function () {
        this.dispatchEvent(new Event(Event.COMPLETE));
    }

    p.getToken = function () {
        var str = "";
        str += new Date().getTime();
        str += "_";
        for (var i = 0; i < 32; ++i) {
            str += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 36)];
        }
        return str;
    }

    return Login;

})(EventDispatcher);

global.Login = Login;