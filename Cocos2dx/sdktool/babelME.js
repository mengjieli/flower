require("./help/com/requirecom");
require("./help/shell/requireshell");

var count = 1;
var lastTime = (new Date()).getTime();

function complete(list) {
    var now = (new Date()).getTime();
    console.log("babel complete! " + count + " ,time :" + (now - lastTime) / 1000 + "s");
    lastTime = now;
    count++;
    setTimeout(function () {
        babel(list, 0);
    }, 500);
}

function babel(list, index) {
    if (index >= list.length) {
        complete(list);
        return;
    }
    var jsFile = list[index];
    new ShellCommand("node", [list[index]], function () {
            index++;
            babel(list, index);
        }, null,
        function (data) {
            console.log(data);
        }, null,
        function (data) {
            console.log(data);
        }, null);
}

//babelextension
//babel(["./sdktool/babel.js", "./sdktool/babelremoteserver.js", "./sdktool/babelremote.js"], 0);
babel(["./sdktool/babelmath.js","./sdktool/babel.js"], 0);