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
    }, 100);
}

function babel(list, index) {
    if (index >= list.length) {
        complete(list);
        return;
    }
    var jsFile = list[index];
    console.log(jsFile,index);
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

//function babel() {
//    new ShellCommand("node", ["./sdktool/babel.js"], function () {
//            new ShellCommand("node", ["./sdktool/babelextension.js"], function () {
//                    new ShellCommand("node", ["./sdktool/babelremoteserver.js"], function () {
//                            complete();
//                        }, null,
//                        function (data) {
//                            console.log(data);
//                        }, null,
//                        function (data) {
//                            console.log(data);
//                        }, null);
//
//                    //new ShellCommand("node", ["./sdktool/babelbinding.js"], function () {
//                    //        complete();
//                    //}, null,
//                    //function (data) {
//                    //    console.log(data);
//                    //}, null,
//                    //function (data) {
//                    //    console.log(data);
//                    //}, null);
//
//                }, null,
//                function (data) {
//                    console.log(data);
//                }, null,
//                function (data) {
//                    console.log(data);
//                }, null);
//        }, null,
//        function (data) {
//            console.log(data);
//        }, null,
//        function (data) {
//            console.log(data);
//        }, null);
//}


babel(["./sdktool/babel.js", "./sdktool/babelremoteserver.js"], 0);