require("./../tools/com/requirecom");

var file = new File("./aa.txt");
var content = file.readContent();
content = StringDo.replaceString(content, "\r", "\n");
content = StringDo.replaceString(content, "\n\n", "\n");
var arr = content.split("\n");
var cfg = [];
for (var i = 20000; i < arr.length; i++) {
    var str = arr[i];
    str = StringDo.replaceString(str, " ", "");
    if (str.length == 0) continue;
    cfg.push({"user":str,"password":"c987654r"});
}
(new File("./account2.json")).save(JSON.stringify(cfg));
