class File {

    __native;
    __url;
    __isExist;
    __isDirectory;
    __parent;

    constructor(url) {
        this.__url = url;
        this.__native = new PlatformFile(url);
        if (this.isDirectory && this.url.charAt(this.url.length - 1) != "/") {
            this.__url += "/";
        }
    }

    /**
     * 读取文件内容
     * @param format 读取的格式，默认为 FileFormat.UTF8，可选参数为 FileFormat.UTF8 和 FileFormat.BINARY
     * @param backFormat 返回的格式，默认为读取的格式，可选参数为 FileFormat 的全部格式
     */
    getContent(format, backFormat) {
        this.__native.readContent(format, backFormat);
    }

    /**
     * 返回目录，包括递归子目录下所有文件和文件夹的 File 组成的数组
     * @returns {Array<File>}
     */
    getDirectoryListing() {
        var files = [this];
        var natives = this.__native.readDirectionList(File);
        for (var i = 0; i < natives.length; i++) {
            var file = new File(natives[i].url);
            file.__native = natives[i];
            files.push(file);
        }
        return files;
    }

    /**
     * 返回目录，包括递归子目录下所有满足格式结尾的文件的 File 组成的数组
     * @params ends 文件格式数组
     * @returns {Array<File>}
     */
    getFileListing(ends) {
        var files = [];
        if (typeof ends == "string") {
            ends = [ends];
        }
        for (var i = 0; i < ends.length; i++) {
            if (ends[i] == this.__native.end) {
                files.push(this);
                break;
            }
        }
        var natives = this.__native.readFilesWidthEnd(File, File);
        for (var i = 0; i < natives.length; i++) {
            var file = new File(natives[i].url);
            file.__native = natives[i];
            files.push(file);
        }
        return files;
    }

    /**
     * 返回相对目录 path 的 File
     * @param path
     * @returns {File}
     */
    resolvePath(path) {
        if (!this.exists) {
            return null;
        }
        path = flower.Path.joinPath(this.nativePath, path);
        return new File(path);
    }

    /**
     * 保存文件
     * @param data 文件数据
     * @param format 格式，默认为 FileFormat.UTF8，可选参数为 FileFormat.UTF8 和 FileFormat.BINARY
     * @param url 保存的目录，默认为当前文件目录
     * @return {File} 返回保存目录的 File，如果保存目录为当前目录，则返回当前 File
     */
    save(data, format, url) {
        url = url || this.url;
        format = format || "utf-8";
        this.__native.save(data, format, url);
        if (url == this.url) {
            return this;
        }
        return new File(url);
    }

    delete() {
        this.__native.delete();
    }

    clone() {
        return new File(this.url);
    }

    get url() {
        return this.__url;
    }

    get exists() {
        return this.__native.__isExist;
    }

    get isDirectory() {
        return this.__native.__isDirectory;
    }

    /**
     * 在系统中的完整目录
     * @returns {*}
     */
    get nativePath() {
        return this.__native.nativePath;
    }

    /**
     * 获取父类文件夹
     * @returns {*}
     */
    get parent() {
        if (!this.exists || path.split("/").length == 1) {
            this.__parent = null;
            return null;
        }
        var path = this.nativePath;
        if (!this.__parent) {
            this.__parent = new File(path.slice(0, path.length - (path.split("/")[path.split("/").length - 1]).length));
        }
        return this.__parent;
    }
}

exports.File = File;