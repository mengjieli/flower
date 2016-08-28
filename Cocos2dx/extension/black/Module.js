class Module extends flower.EventDispatcher {

    __progress;
    __list;
    __index;
    __url;
    __direction;
    __beforeScript;
    __moduleKey;

    constructor(url, beforeScript = "") {
        super();
        Module.instance = this;
        this.__url = url;
        this.__beforeScript = beforeScript;
        this.__direction = flower.Path.getPathDirection(url);
        this.__moduleKey = "key" + Math.floor(Math.random() * 100000000);
        this.__progress = flower.DataManager.getInstance().createData("ProgressData");
    }

    load() {
        var url = this.__url;
        this.__progress.tip.value = url;
        var loader = new flower.URLLoader(url);
        loader.load();
        loader.addListener(flower.Event.COMPLETE, this.__onLoadModuleComplete, this);
        loader.addListener(flower.Event.ERROR, this.__loadError, this);
    }

    __onLoadModuleComplete(e) {
        var cfg = e.data;
        var namespace = cfg.namespace || "local";
        flower.UIParser.addNameSapce(namespace, cfg.name);
        this.__list = [];
        var classes = cfg.classes;
        if (classes && Object.keys(classes).length) {
            for (var key in  classes) {
                var url = classes[key];
                if (url.slice(0, 2) == "./") {
                    url = this.__direction + url.slice(2, url.length);
                }
                flower.UIParser.setLocalUIURL(key, url, namespace);
            }
        }
        this.script = "";
        this.script += this.__beforeScript;
        this.script += "var module = $root." + cfg.name + " = $root." + cfg.name + "||{};\n";
        this.__beforeScript += "var module = $root." + cfg.name + ";\n";
        this.__beforeScript += "var moduleKey = \"key" + Math.floor(Math.random() * 100000000) + "\";\n";
        this.script += "module.path = \"" + this.__direction + "\";\n";
        this.script += "var moduleKey = \"" + this.__moduleKey + "\";\n";
        flower.UIParser.setNameSpaceBeforeScript(namespace, this.__beforeScript);
        var scripts = cfg.scripts;
        if (scripts && Object.keys(scripts).length) {
            for (var i = 0; i < scripts.length; i++) {
                var url = scripts[i];
                if (url.slice(0, 2) == "./") {
                    url = this.__direction + url.slice(2, url.length);
                }
                this.__list.push({
                    type: "script",
                    url: url
                });
            }
        }
        var data = cfg.data;
        if (data && Object.keys(data).length) {
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
        if (components && Object.keys(components).length) {
            for (var i = 0; i < components.length; i++) {
                var url = components[i];
                if (url.slice(0, 2) == "./") {
                    url = this.__direction + url.slice(2, url.length);
                }
                var parser = new flower.UIParser(this.__beforeScript);
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
            this.dispatch(e);
        } else {
            $error(e.data);
        }
    }

    __loadNext(e) {
        var item;
        if (this.__index != 0) {
            item = this.__list[this.__index - 1];
            if (item.type == "data") {
                flower.DataManager.getInstance().addDefine(e.data,this.__moduleKey);
            } else if (item.type == "script") {
                this.script += e.data + "\n\n\n";
                if (this.__index == this.__list.length || this.__list[this.__index].type != "script") {
                    //trace("执行script:\n", this.script);
                    eval(this.script);
                }
            }
        }
        if (this.__list.length == 0) {
            this.__index = this.__list.length = 1;
        }
        this.__progress.max.value = this.__list.length;
        this.__progress.current.value = this.__index;
        if (this.__index == this.__list.length) {
            this.dispatchWith(flower.Event.COMPLETE);
            return;
        }
        item = this.__list[this.__index];
        if (item.type == "ui") {
            var ui = this.__list[this.__index].ui;
            var url = this.__list[this.__index].url;
            ui.addListener(flower.Event.COMPLETE, this.__loadNext, this);
            ui.addListener(flower.Event.ERROR, this.__loadError, this);
            ui.parseAsync(url);
        } else if (item.type == "data" || item.type == "script") {
            var loader = new flower.URLLoader(item.url);
            loader.addListener(flower.Event.COMPLETE, this.__loadNext, this);
            loader.addListener(flower.Event.ERROR, this.__loadError, this);
            loader.load();
        }
        this.__index++;
    }

    get progress() {
        return this.__progress;
    }
}

exports.Module = Module;