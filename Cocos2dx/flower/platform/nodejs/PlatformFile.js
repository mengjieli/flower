class PlatformFile {

    __url;
    __nativePath;
    __isExist;
    __isDirectory;
    __name = "";
    __end = "";

    constructor(url) {
        this.__url = url;
        try {
            this.state = fs.statSync(this.url);
            this.__isExist = fs.existsSync(url);
        } catch (e) {
            this.__isExist = false;
        }
        if (this.__isExist) {
            this.__getNativePath();
            this.__isDirectory = this.state.isDirectory();
            this.__name = url.split("/")[url.split("/").length] - 1;
            if (!this.__isDirectory) {
                var name = this.name;
                if (name.split(".").length > 1) {
                    this.__end = name.split(".")[name.split(".").length - 1];
                    this.__name = name.slice(0, name.length - this.__end.length);
                }
            }
        }
    }

    __getNativePath() {
        var path = process.cwd();
        if (path.length && path.charAt(path.length - 1) != "/") {
            path += "/";
        }
        this.__nativePath = flower.Path.joinPath(path, this.__url);
    }

    save(data, format, url) {
        url = url || this.url;
        format = format || "utf-8";
        if (url.split("/").length > 1 || url.split(".").length == 1) {
            if (url.split(".").length == 1) {
                var dir = new PlatformFile(url.slice(0, url.length - url.split("/")[url.split("/").length - 1].length));
                if (!dir.isExist || !dir.isDirectory) {
                    PlatformFile.mkdirsSync(url);
                }
            } else {
                PlatformFile.mkdirsSync(url.slice(0, url.length - url.split("/")[url.split("/").length - 1].length));
            }
        }
        fs.writeFileSync(url, data, format);
    }

    readContent(format, backFormat) {
        format = format || "utf-8";
        if (!this.exists || this.isDirectory) {
            return null;
        }
        var content = fs.readFileSync(this.url, format);
        if (backFormat == "Buffer" || backFormat == "Array") {
            var array = [];
            for (var i = 0; i < content.length; i++) {
                array.push(content.charCodeAt(i));
            }
            if (backFormat == "Array") {
                return array;
            } else if (backFormat == "Buffer") {
                return new Buffer(array);
            }
        }
        return content;
    }

    readFilesWidthEnd(ends, clazz) {
        clazz = clazz || PlatformFile;
        var files = [];
        if (!this.isDirectory) {
        } else if (this.isDirectory) {
            var list = fs.readdirSync(this.url);
            for (var i = 0; i < list.length; i++) {
                file = new clazz(this.url + "/" + list[i]);
                files = files.concat(file.readFilesWidthEnd(ends));
            }
        }
        return files;
    }

    readDirectionList(clazz) {
        clazz = clazz || PlatformFile;
        var files = [];
        if (!this.isDirectory) {
        } else if (this.isDirectory) {
            var list = fs.readdirSync(this.url);
            for (var i = 0; i < list.length; i++) {
                file = new clazz(this.url + "/" + list[i]);
                files = files.concat(file.readDirectionList());
            }
        }
        return files;
    }

    delete() {
        if (!this.exists) {
            return;
        }
        if (!this.isDirectory) {
            fs.unlinkSync(this.url);
        } else if (this.isDirectory) {
            var list = fs.readdirSync(this.url);
            for (var i = 0; i < list.length; i++) {
                file = new PlatformFile(this.url + "/" + list[i]);
                file.delete();
            }
            fs.rmdirSync(this.url);
        }
    }

    get url() {
        return this.__url;
    }

    get nativePath() {
        return this.__nativePath;
    }

    get exists() {
        return this.__isExist;
    }

    get isExist() {
        return this.__isExist;
    }

    get name() {
        return this.__name;
    }

    get end() {
        return this.__end;
    }

    get isDirectory() {
        return this.__isDirectory;
    }

    get size() {
        return this.state.size;
    }

    get changeTime() {
        return this.state.ctime.getTime();
    }

    get modifyTime() {
        return this.state.mtime.getTime();
    }

    get createTime() {
        return this.state.birthtime.getTime();
    }

    static mkdirsSync(dirpath, mode) {
        if (!fs.existsSync(dirpath)) {
            var pathtmp;
            dirpath.split(path.sep).forEach(function (dirname) {
                if (dirname == "") {
                    pathtmp = "/"
                    return;
                }
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                }
                else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true;
    }
}