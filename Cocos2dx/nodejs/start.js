require("./com/requirecom");
require("./net/requirenet");


var httpServer = new HttpServer(12000, "./../");
httpServer.start();