function init() {
    this.loadPorject("res/project.json");
    console.log(editor.ProjectData);
}

function loadPorject(url) {
    var loader = new flower.URLLoader(url);
    loader.addListener(flower.Event.COMPLETE, this.__onLoadConfig, this);
    loader.load();
}

function __onLoadConfig(e) {
    var config = e.data;
}