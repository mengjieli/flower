class Theme extends flower.EventDispatcher {

    __progress;
    __list;
    __index;
    __url;
    __direction;

    constructor(url) {
        super();
        Theme.instance = this;
        this.__url = url;
        this.__direction = flower.Path.getPathDirection(url);
        this.__progress = flower.DataManager.getInstance().createData("ProgressData");
    }

    load() {
        var url = this.__url;
        this.__progress.tip.value = url;
        var loader = new flower.URLLoader(url);
        loader.load();
        loader.addListener(flower.Event.COMPLETE, this.__onLoadThemeComplete, this);
        loader.addListener(flower.IOErrorEvent.ERROR, this.__loadError, this);
    }

    __onLoadThemeComplete(e) {
        var cfg = e.data;
        this.__list = [];
        for (var i = 0; i < cfg.length; i++) {
            var key = cfg[i].class;
            var url = cfg[i].url;
            if (url.slice(0, 2) == "./") {
                url = this.__direction + url.slice(2, url.length);
            }
            this.__list.push({
                class: key,
                ui: new flower.UIParser(),
                url: url
            });
        }
        this.__index = 0;
        this.__loadNext();
    }

    __loadError(e) {
        if (this.hasListener(flower.Event.ERROR)) {
            this.dispatchWidth(flower.Event.ERROR, e.data);
        } else {
            $error(e.data);
        }
    }

    __loadNext() {
        this.__progress.max.value = this.__list.length;
        this.__progress.current.value = this.__index;
        if (this.__index == this.__list.length) {
            this.dispatchWidth(flower.Event.COMPLETE);
            return;
        }
        var ui = this.__list[this.__index].ui;
        var url = this.__list[this.__index].url;
        ui.addListener(flower.Event.COMPLETE, this.__loadNext, this);
        ui.addListener(flower.IOErrorEvent.ERROR, this.__loadError, this);
        ui.parseAsync(url);
        this.__index++;
    }

    getObject(className) {
        for (var i = 0; i < this.__list.length; i++) {
            if (this.__list[i].class == className && this.__list[i].ui.className) {
                return new this.__list[i].ui.classDefine();
            }
        }
        return null;
    }

    getClass(className) {
        for (var i = 0; i < this.__list.length; i++) {
            if (this.__list[i].class == className && this.__list[i].ui.className) {
                return this.__list[i].ui.classDefine;
            }
        }
        return null;
    }

    get progress() {
        return this.__progress;
    }

    static instance;

    static getInstance() {
        return Theme.instance;
    }

    static getObject(className) {
        var theme = Theme.getInstance();
        if (theme) {
            return theme.getObject(className);
        }
        return null;
    }

    static getClass(className) {
        var theme = Theme.getInstance();
        if (theme) {
            return theme.getClass(className);
        }
        return null;
    }
}

exports.Theme = Theme;