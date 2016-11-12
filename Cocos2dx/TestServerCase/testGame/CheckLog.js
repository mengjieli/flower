require("./../tools/com/requirecom");

var args = process.argv;
var url = args[2];
var content = (new File(url)).readContent();

function checkFile() {
    var newContent = (new File(url)).readContent();
    var more = newContent.slice(content.length,newContent.length);
    content = newContent;
    while(more.charAt(0) == "\n" || more.charAt(0) == "\r") {
        more = more.slice(1,more.length);
    }
    while(more.charAt(more.length) == "\n" || more.charAt(more.length) == "\r") {
        more = more.slice(0,more.length-1);
    }
    if(more.length) {
        console.log(more);
    }
    setTimeout(checkFile, 1000);
}

setTimeout(checkFile, 1000);