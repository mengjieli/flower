var path = require("path");
require("./../../tools/com/requirecom");
require("./../../tools/net/requirenet");
//
require("./Login");
require("./GameClient");
require("./LoginGame");

var config;
var users;
var list = [];
var id = 0;
var threadClose = false;

if (process.send) {
    process.on('message', function (msg) {
        var type = msg.type;
        //console.log(type);
        switch (type) {
            case "config":
                config = msg.message;
                break;
            case "users":
                users = msg.message;
                break;
            case "start":
                //console.log(config,users);
                id = msg.message;
                list.length = 0;
                for (var i = 0; i < users.length; i++) {
                    startUser(users[i]);
                }
                process.send({"type": "ready"});
                break;
            case "login":
                for (var i = 0; i < list.length; i++) {
                    var user = list[i];
                    if (!user.login && !user.isLogin) {
                        loginUser(user);
                        break;
                    }
                }
                break;
            case "quit":
                threadClose = true;
                for (var i = 0; i < list.length; i++) {
                    var user = list[i];
                    if (user.client) {
                        user.client.close();
                    }
                }
                process.send({"type": "quit"});
                break;
            case "kill":
                threadClose = true;
                for (var i = 0; i < list.length; i++) {
                    var user = list[i];
                    if (user.client) {
                        user.client.close();
                    }
                }
                break;
        }
    });
}

function startUser(user) {
    var data = {
        user: user.user,
        password: user.password,
        httpIp: config.httpIp,
        gameIp: config.gameIp,
        login: false,
        isLogin: false
    };
    list.push(data);
}

function loginUser(user) {
    //var user = users[1000];
    //var data = {
    //    user: user.user,
    //    password: user.password,
    //    httpIp: config.httpIp,
    //    gameIp: config.gameIp,
    //    login: false
    //}
    //console.log("Account login " + user.user)
    user.isLogin = true;
    var login = new Login(user.user, user.password, config.httpIp, config.gameIp);
    login.addEventListener(Event.COMPLETE, function () {
        user.token = login.token;
        var client = new GameClient(user, id);
        user.client = client;
        client.dispatcher.addEventListener("loginGameComplete", function (e) {
            user.isLogin = false;
            user.login = true;
            if(threadClose) {
                return;
            }
            process.send({"type": "loginAccountComplete", "account": user.user});
        });
        client.dispatcher.addEventListener("loginOut", function (e) {
            //console.log("loginOut!")
            if(threadClose) {
                return;
            }
            process.send({"type": "userLoginOut", "account": user.user});
            if (user.isLogin == true) {
                user.isLogin = false;
                if(threadClose) {
                    return;
                }
                process.send({"type": "notLoginning",account:user.user});
            } else {
                if (user.login) {
                    user.login = false;
                }
            }
        });
    });
}

//process.send({"type": "complete","message":"Update complete, svn version:"});