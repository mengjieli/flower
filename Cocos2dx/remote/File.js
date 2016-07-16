class File {

    __path;
    __autoUpdate;

    constructor(path, autoUpdate = true) {
        this.__path = path;
        this.__autoUpdate = autoUpdate;
    }

    saveText(text, back, thisObj) {
        new SaveFileRemote(back, thisObj, this.__path, text, "text");
    }

    savePNG(colors, width, height, back, thisObj) {
        new SaveFileRemote(back, thisObj, this.__path, colors, "png", width, height);
    }
}

exports.File = File;