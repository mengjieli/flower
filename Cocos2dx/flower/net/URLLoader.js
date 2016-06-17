class URLLoader extends EventDispatcher {

    _res;
    _isLoading = false;
    _data;
    _linkLoader;
    _links;
    _type;
    _selfDispose = false;

    constructor(res) {
        super();
        this._res = res;
        this._type = this._res.type;
        this.load();
    }
}