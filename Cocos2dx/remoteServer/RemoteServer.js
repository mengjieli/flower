require("./com/requirecom");
require("./ftp/requireftp");
require("./net/requirenet");
require("./shell/requireshell");

class RemoteServer {
    constructor() {
        var file = new File("./");
        var files = file.readDirectionList();
        console.log(files);
    }
}