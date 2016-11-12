var SVNDifference = function (url, lastVersion, currentVersion, svn) {
    this.url = url;
    this.relativeurl = url.slice(svn.localsvndir.length, url.length);
    this.lastVersion = lastVersion;
    this.currentVersion = currentVersion;
    this.type = null;
}

SVNDifference.prototype.delete = function () {
    this.type = SVNDifferenceType.DEL;
}

SVNDifference.prototype.add = function () {
    this.type = SVNDifferenceType.ADD;
}

SVNDifference.prototype.modify = function () {
    this.type = SVNDifferenceType.MODIFY;
}

/**
 *
 Index: svnsrc/svndir/CCC.txt
 ===================================================================
 --- svnsrc/svndir/CCC.txt       (revision 1331)
 +++ svnsrc/svndir/CCC.txt       (revision 1332)
 @@ -1 +0,0 @@
 -cccc
 \ No newline at end of file


 Index: svnsrc/svndir/BBB.txt
 ===================================================================
 --- svnsrc/svndir/BBB.txt       (revision 1331)
 +++ svnsrc/svndir/BBB.txt       (revision 1332)
 @@ -1 +1 @@
 -111
 \ No newline at end of file
 +bbbb
 \ No newline at end of file


 Index: svnsrc/svndir/DDD.txt
 ===================================================================
 --- svnsrc/svndir/DDD.txt       (revision 0)
 +++ svnsrc/svndir/DDD.txt       (revision 1332)
 @@ -0,0 +1 @@
 +ddddd
 \ No newline at end of file

 Property changes on: svnsrc/svndir/DDD.txt
 ___________________________________________________________________
 Added: svn:eol-style
 ## -0,0 +1 ##
 +native
 \ No newline at end of property
 * @param content
 */
SVNDifference.changeStringToDifferences = function (content, svn) {
    //console.log(" ");
    //console.log(content);
    //console.log(" ");
    var list = [];
    while (StringDo.findString(content, "Index: ", 0) != -1) {
        //处理 Index: svnsrc/svndir/DDD.txt
        var index = 0;
        var start = StringDo.findString(content, "Index: ", index) + "Index: ".length;
        var end = StringDo.findString(content, "\n", start);
        var url = content.slice(start, end);
        content = content.slice(end + 1, content.length);


        //跳过===================================================================
        end = StringDo.findString(content, "\n", index);
        content = content.slice(end + 1, content.length);

        //Cannot display: file marked as a binary type.
        //svn:mime-type = application/octet-stream
        if (content.slice(index, index + "---".length) != "---") {
            var diff = new SVNDifference(url, 0, 0, svn);
            if ((new File(url)).isExist()) {
                diff.modify();
            } else {
                diff.delete();
            }
            list.push(diff);
            //Cannot display: file marked as a binary type.
            end = StringDo.findString(content, "\n", index);
            content = content.slice(end + 1, content.length);
        } else {
            //分析 --- svnsrc/svndir/DDD.txt       (revision 0)
            //    +++ svnsrc/svndir/DDD.txt       (revision 1332)
            start = StringDo.findString(content, "(revision ", index);
            end = StringDo.findString(content, ")", index);
            var lastVersion = parseInt(content.slice(start + "(revision ".length, end));
            //跳过 --- svnsrc/svndir/DDD.txt       (revision 0)
            end = StringDo.findString(content, "\n", index);
            content = content.slice(end + 1, content.length);

            start = StringDo.findString(content, "(revision ", index);
            end = StringDo.findString(content, ")", index);
            var currentVersion = parseInt(content.slice(start + "(revision ".length, end));
            //跳过 +++ svnsrc/svndir/DDD.txt       (revision 1332)
            end = StringDo.findString(content, "\n", index);
            content = content.slice(end + 1, content.length);

            var diff = new SVNDifference(url, lastVersion, currentVersion, svn);
            list.push(diff);
            //分析 @@ -1 +0,0 @@ 删除
            //分析 @@ -1 +1 @@ 修改
            //分析 @@ -0,0 +1 @@ 增加
            start = StringDo.findString(content, "@@ ", index) + "@@ ".length;
            end = StringDo.findString(content, " @@", start);
            var linestr = content.slice(start, end);
            var lastChar = linestr.split(",")[linestr.split(",").length - 1];
            if (lastChar == "0") { //删除
                diff.delete();
                //console.log("删除");
            } else if (lastVersion == 0) { //添加
                diff.add();
                //console.log("添加");
            } else { //修改
                diff.modify();
                //console.log("修改");
            }
            //跳过 @@ ... @@
            end = StringDo.findString(content, "\n", index);
            content = content.slice(end + 1, content.length);
        }
    }
    return list;
}

var SVNDifferenceType = {
    "ADD": "add", //增加
    "DEL": "del", //删除
    "MODIFY": "modify" //修改
};

global.SVNDifference = SVNDifference;
global.SVNDifferenceType = SVNDifferenceType;