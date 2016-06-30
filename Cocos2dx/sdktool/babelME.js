require("./help/com/requirecom");
require("./help/shell/requireshell");

var count = 1;
function babel() {
    new ShellCommand("node", ["./sdktool/babel.js"], function () {
            new ShellCommand("node", ["./sdktool/babelextension.js"], function () {
                    console.log("babel complete! " + count);
                    count++;
                    setTimeout(babel, 100);
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