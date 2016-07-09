function set path(val) {
    this._path = val;
    this.name = flower.Path.getName(val);
    this.fileType = flower.Path.getFileType(val);
}

function get path() {
    return this._path || "";
}