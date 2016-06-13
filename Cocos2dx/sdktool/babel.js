require("./help/com/requirecom");
require("./help/shell/requireshell");
require("./help/ftp/requireftp");
require("./help/net/requirenet");

new ShellCommand("babel", ["./src6", "-d", "./src"], function () {
        //console.log("complete!")

//生成 js 依赖关系的文件

        var readDir = "./src6";
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
                        begin = begin + "extends".length;
                        begin = StringDo.jumpStrings(content, begin, [" ", "\t"]);
                        var superClass = content.slice(begin, StringDo.findCharNotABC(content, begin));
                        this.dependClasses.push(superClass);
                        //console.log(name + " -> " + this.dependClasses);
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
                console.log("[warn] not find class : " + file.url);
            }
        }

        var file = new global.File(readDir);
        var files = file.readFilesWidthEnd("js");
        var list = [];
        for (var i = 0; i < files.length; i++) {
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
                    info.url = StringDo.replaceString(info.url,"src6","src");
                    str += "jsFiles.push(\"" + info.url.slice(2, info.url.length) + "\" );\n";
                    break;
                }
            }
        }

        var beginStr = "";
        beginStr = "var jsFiles = jsFiles||[];\n";
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/core/StageCocos2DX.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/display/Cliper.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/display/Graphics.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/display/InputTextField.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/display/TextField.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/event/MouseEvent.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/managers/plist/PlistFrameInfo.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/managers/plist/PlistInfo.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/managers/PlistManager.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/managers/texture/Texture2D.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/managers/TextureManager.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/utils/UTFChange.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/utils/Blend.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/utils/FileUtils.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/cocos2dx/net/URLLoader.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/net/VByteArray.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/net/WebSocket.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/tween/BasicPlugin.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/tween/Ease.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/tween/EaseFunction.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/tween/TimeLine.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/tween/Tween.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/tween/plugins/TweenCenter.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/tween/plugins/TweenPath.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/tween/plugins/TweenPhysicMove.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/utils/ObjectDo.js");\n';
//        beginStr += 'jsFiles.push("src/com/flower/utils/StringDo.js");\n';
//        beginStr += 'jsFiles.push("src/com/jc/ui/utils/CallLater.js");\n';
//        beginStr += 'jsFiles.push("src/com/jc/ui/utils/DelayCall.js");\n';
//        beginStr += 'jsFiles.push("src/com/jc/ui/utils/EnterFrame.js");\n';
//        beginStr += 'jsFiles.push("src/com/jc/utils/ColorTransform.js");\n';
//        beginStr += 'jsFiles.push("src/com/jc/utils/TypeHelp.js");\n';
//        beginStr += 'jsFiles.push("src/com/jc/utils/json/JSONDecoder.js");\n';
//        beginStr += 'jsFiles.push("src/com/jc/utils/Matrix.js");\n';
//        beginStr += 'jsFiles.push("src/com/jc/utils/StringHelp.js");\n';
//        beginStr += 'jsFiles.push("src/com/jc/utils/xml/XMLAttribute.js");\n';
//        beginStr += 'jsFiles.push("src/com/jc/utils/xml/XMLElement.js");\n';
//        beginStr += 'jsFiles.push("src/com/sound/Sound.js");\n';
        str = beginStr + str;
        var saveFile = new File(writeFile);
        saveFile.save(str, "utf-8");


    }, null, function (data) {
        //console.log(data);
    }, null,
    function (e) {
        console.log(e);
    })
