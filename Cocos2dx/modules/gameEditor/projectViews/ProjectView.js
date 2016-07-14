function init() {
    this.clickItem = this.onClickItem.bind(this);
    this.loadPorject("flower.json");
}

function onClickItem(e) {
    var item = e.item;
    //console.log("item:", item);
    if (item.plugin) {
        editor.EventManager.instance.dispatchWidth(editor.ModuleEvent.VIEW_FILE, item);
    }
}

function loadPorject(url) {
    var loader = new flower.URLLoader(url);
    loader.addListener(flower.Event.COMPLETE, this.__onLoadConfig, this);
    loader.load();
}

function __onLoadConfig(e) {
    var cfg = this.config = e.data;
    this.title = cfg.name;
    //flower.breakPoint();
    var direction = this.data.direction;
    direction.removeAll();
    for (var key in cfg.direction) {
        direction.push({
            isDirection: true,
            path: "res/" + key,
            name: cfg.direction[key].name,
        });
        var list = cfg.direction[key].list;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            direction.push({
                path: item.path,
                name: flower.Path.getName(item.path),
                plugin: item.plugin,
                fileType: key
            });
        }
    }
}

function get title() {
    return this._title || (this._title = new flower.StringValue());
}

function set title(val) {
    if (!this._title) {
        this._title = new flower.StringValue();
    }
    this._title.value = val;
}