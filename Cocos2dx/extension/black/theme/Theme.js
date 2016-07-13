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
        var namespace = cfg.namespace || "local";
        flower.UIParser.addNameSapce(namespace, cfg.packageURL);
        var classes = cfg.classes;
        if (classes) {
            for (var key in  classes) {
                var url = classes[key];
                if (url.slice(0, 2) == "./") {
                    url = this.__direction + url.slice(2, url.length);
                }
                flower.UIParser.setLocalUIURL(key, url, namespace);
            }
        }
        this.__list = [];
        var data = cfg.data;
        if (data) {
            for (var i = 0; i < data.length; i++) {
                var url = data[i];
                if (url.slice(0, 2) == "./") {
                    url = this.__direction + url.slice(2, url.length);
                }
                this.__list.push({
                    type: "data",
                    url: url
                });
            }
        }
        var components = cfg.components;
        if (components) {
            for (var i = 0; i < components.length; i++) {
                var url = components[i];
                if (url.slice(0, 2) == "./") {
                    url = this.__direction + url.slice(2, url.length);
                }
                var parser = new flower.UIParser();
                parser.localNameSpace = namespace;
                this.__list.push({
                    type: "ui",
                    ui: parser,
                    url: url
                });
            }
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

    __loadNext(e) {
        var item;
        if (this.__index != 0) {
            item = this.__list[this.__index - 1];
            if (item.type == "data") {
                flower.DataManager.getInstance().addDefine(e.data);
            }
        }
        this.__progress.max.value = this.__list.length;
        this.__progress.current.value = this.__index;
        if (this.__index == this.__list.length) {
            this.dispatchWidth(flower.Event.COMPLETE);
            return;
        }
        item = this.__list[this.__index];
        if (item.type == "ui") {
            var ui = this.__list[this.__index].ui;
            var url = this.__list[this.__index].url;
            ui.addListener(flower.Event.COMPLETE, this.__loadNext, this);
            ui.addListener(flower.IOErrorEvent.ERROR, this.__loadError, this);
            ui.parseAsync(url);
        } else if (item.type == "data") {
            var loader = new flower.URLLoader(item.url);
            loader.addListener(flower.Event.COMPLETE, this.__loadNext, this);
            loader.addListener(flower.IOErrorEvent.ERROR, this.__loadError, this);
            loader.load();
        }
        this.__index++;
    }

    get progress() {
        return this.__progress;
    }
}

exports.Theme = Theme;