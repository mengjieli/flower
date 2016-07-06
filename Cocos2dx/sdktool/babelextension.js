require("./help/com/requirecom");
require("./help/shell/requireshell");

function compressComplete() {
    new ShellCommand("babel", ["./srcExtension", "-d", "./src"], function () {
            //console.log("complete!")

//生成 js 依赖关系的文件

            return;
            var readDir = "./srcExtension";
            var writeFile = "./src/require.js";

            function DoFile(file) {
                this.url = file.url;
                this.dependClasses = [];
                this.className = null;
                var name = file.name;
                var content = file.readContent();
                var begin = 0;
                var find;
                while (begin < content.length && !this.className) {
                    find = false;
                    //查找格式 Class 前后为 " " ,"\t"等等
                    var index = global.StringDo.findStringWidthBeforeAndFollow(content, "class", [0, " ", "\t", "\r", "\n"], [" ", "\t"], begin);

                    if (index == -1) {
                        break;
                    }
                    begin = index + "class".length;
                    begin = StringDo.jumpStrings(content, begin, [" ", "\t"]);
                    if (content.slice(begin, begin + name.length) == name && (content.charAt(begin + name.length) == " " || content.charAt(begin + name.length) == "\t")) {
                        this.className = name;
                        begin = begin + name.length;
                        begin = StringDo.jumpStrings(content, begin, [" ", "\t"]);
                        if (content.slice(begin, begin + "extends".length) == "extends" && (content.charAt(begin + "extends".length) == " " || content.charAt(begin + "extends".length) == "\t")) {
                            console.log(file.url, "extends");
                            begin = begin + "extends".length;
                            begin = StringDo.jumpStrings(content, begin, [" ", "\t"]);
                            var superClass = content.slice(begin, StringDo.findCharNotABC(content, begin));
                            this.dependClasses.push(superClass);
                            console.log(name + " -> " + this.dependClasses);
                        }
                    }
                    if (this.className) {
                        break;
                    }
                    //console.log(begin)
                    //for (var i = index + ("class " + name).length; i < content.length; i++) {
                    //    if (content.charAt(i) == "=") {
                    //        //跳过= 后面的空格
                    //        index = global.StringDo.jumpStrings(content, i + 1, [" ", "\t", "\r", "\n"]);
                    //        //跳过包
                    //        var packageEnd = global.StringDo.jumpPackage(content, index);
                    //        var package = content.slice(index, packageEnd);
                    //        if (package.split(".")[package.split(".").length - 1] == "extend") { //继承
                    //            this.dependClasses.push(package.split(".")[package.split(".").length - 2]);
                    //            this.className = name;
                    //            //console.log(name + " -> " + this.dependClasses);
                    //        } else if (package == "function") { //普通的类定义
                    //            this.className = name;
                    //        } else {
                    //            if (package == "" && content.charAt(index) == "{") { //Object定义
                    //                this.className = name;
                    //            } else {
                    //                begin = index;
                    //            }
                    //        }
                    //    } else if (content.charAt(i) == "(") { //普通的类定义
                    //        this.className = name;
                    //    } else {
                    //        begin = i;
                    //    }
                    //    break;
                    //}
                }
                if (!this.className) {
                    //console.log("[warn] not find class : " + file.url);
                }
            }

            var file = new global.File(readDir);
            var files = file.readFilesWidthEnd("js");
            var list = [];
            for (var i = 0; i < files.length; i++) {
                //console.log(files[i].url)
                if (files[i].url.slice(0, "./srcExtension/flower/".length) == "./srcExtension/flower/") {
                    continue;
                }
                //if (files[i].url.slice(0, "../src/com/".length) == "../src/com/") {
                //    continue;
                //}
                //if (files[i].url.slice(0, "../src/Flower".length) == "../src/Flower") {
                //    continue;
                //}
                //if (files[i].url.slice(0, "../src/a/".length) == "../src/a/") {
                //    continue;
                //}
                //if (files[i].url.slice(0, "../src/gameUpdate/".length) == "../src/gameUpdate/") {
                //    continue;
                //}
                list.push(new DoFile(files[i]));
            }
            for (var i = 0; i < list.length; i++) {
                for (var j = 0; j < list.length; j++) {
                    if (i != j && list[i].className && list[i].className == list[j].className) {
                        console.log("[Error] the same class name :" + list[i].className);
                    }
                }
            }
            var str = "";
            while (list.length) {
                var find;
                var info;
                for (var i = 0; i < list.length; i++) {
                    find = true;
                    info = list[i];
                    if (info.dependClasses.length == 0) {
                    } else {
                        for (var j = 0; j < list.length; j++) {
                            if (i == j) {
                                continue;
                            }
                            var compare = list[j];
                            for (var f = 0; f < info.dependClasses.length; f++) {
                                if (info.dependClasses[f] == compare.className) {
                                    find = false;
                                    break;
                                }
                            }
                            if (!find) {
                                break;
                            }
                        }
                    }
                    if (find) {
                        list.splice(i, 1);
                        info.url = StringDo.replaceString(info.url, "srcExtension", "src");
                        str += "jsFiles.push(\"" + info.url.slice(2, info.url.length) + "\" );\n";
                        break;
                    }
                }
            }

            var beginStr = "";
            beginStr = "var jsFiles = jsFiles||[];\n";


            //str = beginStr + str;
            //var saveFile = new File(writeFile);
            //saveFile.save(str, "utf-8");


        }, null, function (data) {
            //console.log(data);
        }, null,
        function (e) {
            console.log(e);
        })
}

var file = new File("extension/");
var files = file.readFilesWidthEnd("js");
var list = [
    "Black",
    "UIComponent",

    "UIEvent",
    "DataGroupEvent",

    "Value",
    "ArrayValue",
    "BooleanValue",
    "IntValue",
    "NumberValue",
    "ObjectValue",
    "StringValue",
    "UIntValue",
    "DataManager",

    "zh_CN",

    "Layout",
    "LinearLayout",
    "HorizontalLayout",
    "VerticalLayout",

    "Group",
    "UIParser",
    "DataGroup",
    "ItemRenderer",
    "Label",
    "RectUI",
    "Image",
    "TileImage",
    "MaskUI",
    "Button",
    "ToggleButton",
    "CheckBox",
    "RadioButton",
    "RadioButtonGroup",
    "ToggleSwitch",
    "ListBase",
    "List",
    "TabBar",
    "ViewStack",
    "Scroller",
    "Combox",
];
var fileContent = "";
fileContent += "var black = {};\n";
fileContent += "var $root = eval(\"this\");\n";
fileContent += "(function(){\n";
while (list.length) {
    var name = list.shift();
    file = files[i];
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        if (f.name == name) {
            fileContent += "//////////////////////////File:" + files[i].url + "///////////////////////////\n";
            fileContent += files[i].readContent() + "\n";
            fileContent += "//////////////////////////End File:" + files[i].url + "///////////////////////////\n\n\n\n";
        }
    }
}
fileContent += "})();\n";
file = new File("srcExtension/Black.js");
fileContent = StringDo.replaceString(fileContent, "exports.", "black.");
fileContent += "for(var key in black) {\n";
fileContent += "\tflower[key] = black[key];\n";
fileContent += "}\n";
file.save(fileContent);


compressComplete();