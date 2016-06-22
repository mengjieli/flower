class URLLoaderList extends EventDispatcher {

    __list;
    __dataList;
    __index;
    __language;
    __scale;

    constructor(list) {
        super();
        this.__list = list;
        this.__dataList = [];
        this.__index = 0;
    }

    set language(val) {
        this.__language = val;
    }

    set scale(val) {
        this.__scale = val;
    }

    load() {
        this.__loadNext();
    }

    __loadNext() {
        if (this.__index >= this.__list.length) {
            this.dispatchWidth(flower.Event.COMPLETE, this.__dataList);
            this.__list = null;
            this.__dataList = null;
            this.dispose();
            return;
        }
        var item = this.__list[this.__index];
        var load = new flower.URLLoader(item);
        if (this.__language != null) load.language = this.__language;
        if (this.__scale != null) load.scale = this.__scale;
        load.addListener(flower.Event.COMPLETE, this.__onComplete, this);
        load.addListener(IOErrorEvent.ERROR, this.__onError, this);
        load.load();
    }

    __onError(e) {
        if (this.hasListener(IOErrorEvent.ERROR)) {
            this.dispatch(e);
        }
        else {
            $error(e.message);
        }
    }

    __onComplete(e) {
        this.__dataList[this.__index] = e.data;
        this.__index++;
        this.__loadNext();
    }
}

exports.URLLoaderList = URLLoaderList;