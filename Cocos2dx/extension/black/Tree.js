class Tree extends DataGroup {

    constructor() {
        super();
        this.$Tree = {
            0: null,//dataProvider
            1: new flower.ArrayValue(),//dataGroupDataProvider;
            2: {}, //openCloseTable
            3: "path" //pathField
        }
        this.requireSelection = true;
        this.itemSelectedEnabled = true;
        this.itemClickedEnabled = true;
        this.layout = new VerticalLayout();
        super.$setDataProvider(this.$Tree[1]);
    }

    $getDataProvider() {
        return this.$Tree[0];
    }

    $setDataProvider(val) {
        var p = this.$Tree;
        if (p[0] == val) {
            return;
        }
        if (p[0]) {
            p[0].removeListener(flower.Event.CHANGE, this.__onTreeDataUpdate, this);
            p[0].removeListener(flower.Event.REMOVED, this.__onRemovedTreeDataUpdate, this);
        }
        p[0] = val;
        if (p[0]) {
            p[0].addListener(flower.Event.CHANGE, this.__onTreeDataUpdate, this);
            p[0].addListener(flower.Event.REMOVED, this.__onRemovedTreeDataUpdate, this);
        }
        this.__onTreeDataUpdate(null);
    }

    __onRemovedTreeDataUpdate(e) {
        var item = e.data;
        if (item.open && item.open instanceof flower.EventDispatcher) {
            item.open.removeListener(flower.Event.CHANGE, this.__onOpenItem, this);
        }
    }

    __onTreeDataUpdate(e) {
        var p = this.$Tree;
        var treeData = p[0];
        var parentData = p[1];
        var openURL = p[2];
        var pathField = p[3];
        if (!treeData || !treeData.length) {
            parentData.removeAll();
        } else {
            parentData.removeAll();
            var item;
            var url;
            var depth;
            var keys = Object.keys(openURL);
            var rootURL;
            var rootURLDepth = -1;
            var rootList = [];
            var urlList = {};
            for (var i = 0, len = keys.length; i < len; i++) {
                openURL[keys[i]].state = false;
            }
            for (var i = 0, len = treeData.length; i < len; i++) {
                item = treeData.list[i];
                if (typeof item == "string") {
                    url = item;
                    if (!openURL[url]) {
                        openURL[url] = {
                            open: false,
                            state: true
                        }
                    } else {
                        openURL[url].state = true;
                    }
                    openURL[url].open = false;
                } else {
                    url = item[pathField] || "";
                    if (!openURL[url]) {
                        openURL[url] = {
                            open: false,
                            state: true
                        }
                    } else {
                        openURL[url].state = true;
                    }
                    if (item.open != null) {
                        if (item.open instanceof flower.Value) {
                            openURL[url].open = !!item.open.value;
                            item.open.addListener(flower.Event.CHANGE, this.__onOpenItem, this);
                        } else {
                            openURL[url].open = !!item.open;
                        }
                    } else {
                        openURL[url].open = false;
                    }
                }
                depth = url.split("/").length;
                if (rootURLDepth == -1 || rootURLDepth > depth) {
                    rootURLDepth = depth;
                    rootURL = url;
                    rootList = []
                }
                if (depth == rootURLDepth) {
                    rootList.push(url);
                }
                if (!urlList[url]) {
                    urlList[url] = {
                        item: item,
                        depth: depth,
                        children: []
                    }
                } else {
                    urlList[url].item = item;
                }
                if (url.split("/").length > 1) {
                    var parentURL = url.slice(0, url.length - (url.split("/")[url.split("/").length - 1].length + 1));
                    if (!urlList[parentURL]) {
                        urlList[parentURL] = {
                            item: null,
                            depth: null,
                            children: [url]
                        }
                    } else {
                        urlList[parentURL].children.push(url);
                    }
                }
            }
            keys = Object.keys(openURL);
            for (var i = 0, len = keys.length; i < len; i++) {
                if (openURL[keys[i]].state == false) {
                    delete openURL[keys[i]];
                }
            }
            for (var i = 0; i < rootList.length; i++) {
                this.__readTreeShowItem(rootList[i], urlList, openURL, rootURLDepth, parentData);
            }
        }
    }

    __onOpenItem(e) {
        this.__onTreeDataUpdate(null);
    }

    __readTreeShowItem(url, urlList, openURL, rootURLDepth, parentData) {
        var info = urlList[url];
        var item = info.item;
        if (typeof item == "string") {

        } else {
            item.depth = info.depth - rootURLDepth;
            if (item.open != null) {
                if (item.open instanceof flower.Value) {
                    item.open.value = openURL[url].open;
                }
            } else {
                item.open = new BooleanValue(openURL[url].open);
                item.open.addListener(flower.Event.CHANGE, this.__onOpenItem, this);
            }
        }
        parentData.push(item);
        if (openURL[url].open) {
            var children = info.children;
            for (var i = 0, len = children.length; i < len; i++) {
                this.__readTreeShowItem(children[i], urlList, openURL, rootURLDepth, parentData);
            }
        }
    }

    expand(url) {
        var p = this.$Tree;
        var parentData = p[1];
        for (var i = 0; i < parentData.length; i++) {
            var item = parentData[i];
            if (item.path == url.slice(0, item.path.length)) {
                item.open.value = true;
            }
        }
    }

    get pathField() {
        return this.$Tree[3];
    }

    set pathField(val) {
        if (this.$Tree[3] == val) {
            return;
        }
        this.$Tree[3] = val;
        this.__onTreeDataUpdate(null);
    }
}

exports.Tree = Tree;