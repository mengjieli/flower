class RemoteDirection extends flower.EventDispatcher {

    __path;
    __autoUpdate;
    __list;
    __fileClass;
    __updateRemote;

    constructor(path, autoUpdate = true) {
        super();
        this.__path = path;
        this.__autoUpdate = autoUpdate;
        this.__list = new flower.ArrayValue();
        if (this.__path && this.__autoUpdate) {
            new ReadDirectionListRemote(this.__updateDirectionList, this, this.__path, this.__autoUpdate);
        }
    }

    isExist(back, thisObj) {
        new IsDirectionExistRemote(back, thisObj, this.__path);
    }

    readDirectionList(back, thisObj) {
        new ReadDirectionListRemote(back, thisObj, this.__path);
    }

    __updateDirectionList(fileList) {
        var list = this.__list;
        list.length = 0;
        var clazz = this.__fileClass;
        for (var i = 0, len = fileList.length; i < len; i++) {
            if (clazz) {
                list.push(new clazz(fileList[i]));
            } else {
                list.push(fileList[i]);
            }
        }
        this.dispatchWith(flower.Event.CHANGE);
    }

    dispose() {

    }

    get list() {
        return this.__list;
    }

    get fileClass() {
        return this.__fileClass;
    }

    set fileClass(clazz) {
        this.__fileClass = clazz;
        var list = this.__list;
        var fileList = list.list;
        list.length = 0;
        for (var i = 0, len = fileList.length; i < len; i++) {
            if (clazz) {
                list.push(new clazz(fileList));
            } else {
                list.push(fileList);
            }
        }
    }

    get path() {
        return this.__path;
    }

    set path(val) {
        if (this.__path) {
            sys.$error(4001, val);
            return;
        }
        this.__path = val;
        if (this.__path && this.__autoUpdate) {
            new ReadDirectionListRemote(this.__updateDirectionList, this, this.__path);
        }
    }
}

exports.RemoteDirection = RemoteDirection;