module flower {
    export class EventDispatcher {
        private _events:any;

        public constructor() {
            this._events = {};
        }

        public once(type:string, listener:Function, thisObject:any) {
            this._addListener(type, listener, thisObject, true);
        }

        public addListener(type:string, listener:Function, thisObject:any) {
            this._addListener(type, listener, thisObject, false);
        }

        private _addListener(type:string, listener:Function, thisObject:any, once:boolean) {
            if (!this._events) {
                return;
            }
            if (!this._events[type]) {
                this._events[type] = [];
            }
            var list:Array<any> = this._events[type];
            for (var i:number = 0, len:number = list.length; i < len; i++) {
                if (list[i].listener == listener && list[i].thisObject == thisObject && list[i].del == false) {
                    return;
                }
            }
            list.push({"listener": listener, "thisObject": thisObject, "once": once, "del": false});
        }

        public removeListener(type:string, listener:Function, thisObject:any) {
            if (!this._events) {
                return;
            }
            var list:Array<any> = this._events[type];
            if (!list) {
                return;
            }
            for (var i:number = 0, len:number = list.length; i < len; i++) {
                if (list[i].listener == listener && list[i].thisObject == thisObject && list[i].del == false) {
                    list[i].listener = null;
                    list[i].thisObject = null;
                    list[i].del = true;
                    break;
                }
            }
        }

        public removeAllListener() {
            this._events = {};
        }

        public hasListener(type:string):boolean {
            if (!this._events) {
                return false;
            }
            var list:Array<any> = this._events[type];
            if (!list) {
                return false;
            }
            for (var i:number = 0, len:number = list.length; i < len; i++) {
                if (list[i].del == false) {
                    return true;
                }
            }
            return false;
        }

        public dispatch(event:flower.Event) {
            if (!this._events) {
                return;
            }
            var list:Array<any> = this._events[event.type];
            if (!list) {
                return;
            }
            for (var i:number = 0, len:number = list.length; i < len; i++) {
                if (list[i].del == false) {
                    var listener:Function = list[i].listener;
                    var thisObj:any = list[i].thisObject;
                    if (event.$target == null) {
                        event.$target = this;
                    }
                    event.$currentTarget = this;
                    if (list[i].once) {
                        list[i].listener = null;
                        list[i].thisObject = null;
                        list[i].del = true;
                    }
                    listener.call(thisObj, event);
                }
            }
            for (i = 0; i < list.length; i++) {
                if (list[i].del == true) {
                    list.splice(i, 1);
                    i--;
                }
            }
        }

        public dispatchWidth(type:string, data:any = null) {
            if (!this._events) {
                return;
            }
            var e:flower.Event = flower.Event.create(type, data);
            e.$target = this;
            this.dispatch(e);
            flower.Event.release(e);
        }

        public dispose() {
            this._events = {};
        }

    }
}

