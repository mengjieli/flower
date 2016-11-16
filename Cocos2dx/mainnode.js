/*require("./remoteServer/com/requirecom");
require("./remoteServer/net/requirenet");
require("./remoteServer/shell/requireshell");*/


//var list = ["src/FlowerDom.js",
//    "src/Black.js",
//    "src/Binding.js",
//    "src/Remote.js"];


var _root = this;

var file = new File("src/FlowerNodeJS.js");
var content = file.readContent();
content += "_root.flower = flower;";
eval(content);
var flower = _root.flower;

var file = new File("src/Black.js");
var content = file.readContent();
eval(content);

var file = new File("src/Binding.js");
var content = file.readContent();
eval(content);

var file = new File("src/Remote.js");
var content = file.readContent();
eval(content);


var file = new File("src/require.js");
var content = file.readContent();
content += "_root.jsFiles = jsFiles;"
eval(content);
var jsFiles = _root.jsFiles;
content = "";
for (var i = 0; i < jsFiles.length; i++) {
    content += (new File(jsFiles[i])).readContent() + "\n\n\n";
}
content += "new Main();";
eval(content);

