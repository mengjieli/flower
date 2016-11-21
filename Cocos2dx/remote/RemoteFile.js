class RemoteFile {

    __path;
    __autoUpdate;

    constructor(path, autoUpdate = false) {
        this.__path = path;
        this.__autoUpdate = autoUpdate;
    }

    saveText(text, back, thisObj) {
        new SaveFileRemote(back, thisObj, this.__path, text, "text");
    }

    savePNG(colors, width, height, back, thisObj) {
        new SaveFileRemote(back, thisObj, this.__path, colors, "png", width, height);
    }

    isExist( back, thisObj) {
        new IsDirectionExistRemote(back, thisObj, this.__path);
    }

    delete(back, thisObj) {
        new DeleteFileRemote(back, thisObj, this.__path);
    }
}

exports.RemoteFile = RemoteFile;