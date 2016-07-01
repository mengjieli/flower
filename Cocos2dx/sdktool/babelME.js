require("./help/com/requirecom");
require("./help/shell/requireshell");

var count = 1;
var lastTime = (new Date()).getTime();

function complete() {
    var now = (new Date()).getTime();
    console.log("babel complete! " + count + " ,time :" + (now - lastTime) / 1000 + "s");
    lastTime = now;
    count++;
    setTimeout(babel, 100);
}

function babel() {
    new ShellCommand("node", ["./sdktool/babel.js"], function () {
            new ShellCommand("node", ["./sdktool/babelextension.js"], function () {
                    //new ShellCommand("node", ["./sdktool/babelbinding.js"], function () {
                            complete();

                        //}, null,
                        //function (data) {
                        //    console.log(data);
                        //}, null,
                        //function (data) {
                        //    console.log(data);
                        //}, null);

                }, null,
                function (data) {
                    console.log(data);
                }, null,
                function (data) {
                    console.log(data);
                }, null);
        }, null,
        function (data) {
            console.log(data);
        }, null,
        function (data) {
            console.log(data);
        }, null);
}


babel();