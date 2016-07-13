function init() {
    this.loadPorject("flower.json");
}

function loadPorject(url) {
    var loader = new flower.URLLoader(url);
    loader.addListener(flower.Event.COMPLETE, this.__onLoadConfig, this);
    loader.load();
}

function __onLoadConfig(e) {
    var cfg = this.config = e.data;
    this.title = cfg.name;
    flower.breakPoint();
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
            direction.push({
                path: list[i],
                name: flower.Path.getName(list[i]),
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