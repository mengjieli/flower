class RemoteDirection extends flower.EventDispatcher {

    __path;
    __autoUpdate;
    __list;
    __pathList;
    __fileClass;
    __updateRemote;
    __typeFilter;

    constructor(path, autoUpdate = true) {
        super();
        this.__path = path;
        this.__autoUpdate = autoUpdate;
        this.__list = new flower.ArrayValue();
        this.__pathList = [];
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
        var clazz = this.__fileClass;
        var last = 0;
        if (this.__typeFilter) {
            for (var i = 0; i < fileList.length; i++) {
                if (fileList[i].isDirection) continue;
                var findType = false;
                for (var t = 0; t < this.__typeFilter.length; t++) {
                    if (this.__typeFilter[t] == fileList[i].fileType) {
                        findType = true;
                        break;
                    }
                }
                if (!findType) {
                    fileList.splice(i, 1);
                    i--;
                }
            }
        }
        for (var i = 0, len = fileList.length; i < len; i++) {
            var find = false;
            var deleteEnd = this.__pathList.length;
            for (var f = last; f < this.__pathList.length; f++) {
                if (this.__pathList[f] == fileList[i].path) {
                    find = true;
                    deleteEnd = f;
                    break;
                }
            }
            while (last < deleteEnd) {
                this.__pathList.splice(last, 1);
                list.removeItemAt(last);
                deleteEnd--;

            }
            last = deleteEnd + 1;
            if (!find) {
                this.__pathList.push(fileList[i].path);
                if (clazz) {
                    list.push(new clazz(fileList[i]));
                } else {
                    list.push(fileList[i]);
                }
            }
        }
        while (this.__pathList.length > fileList.length) {
            this.__pathList.splice(fileList.length, 1);
            list.removeItemAt(fileList.length);
        }
        this.dispatchWith(flower.Event.CHANGE);
    }

    dispose() {

    }

    get typeFilter() {
        return this.__typeFilter.concat();
    }

    set typeFilter(val) {
        this.__typeFilter = val;
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