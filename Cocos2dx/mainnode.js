/*require("./remoteServer/com/requirecom");
 require("./remoteServer/net/requirenet");
 require("./remoteServer/shell/requireshell");*/


//var list = ["src/FlowerDom.js",
//    "src/Black.js",
//    "src/Binding.js",
//    "src/Remote.js"];

require("./src/FlowerNodeJS");
require("./src/Black");
require("./src/Binding");
require("./src/Remote");
var file = new flower.File("src/require.js");
var content = file.readContent();
content += "global.jsFiles = jsFiles;"
eval(content);
content = "";
for (var i = 0; i < jsFiles.length; i++) {
    content += (new flower.File(jsFiles[i])).readContent() + "\n\n\n";
}
content += "global.Main = Main;";
eval(content);
new Main();

