module flower {
    export class ArrayValue extends EventDispatcher implements ICollection {
        private _length:number;
        private list:Array<any>;
        private _key:string = "";
        private _rangeMinKey:string = "";
        private _rangeMaxKey:string = "";

        public constructor(initList:Array<any> = null) {
            super();
            this.list = initList || [];
            this._length = this.list.length;
        }

        public push(item:any) {
            this.list.push(item);
            this.length = this._length + 1;
            this.dispatchWidth(Event.ADDED, item);
        }

        public addChild(item:any) {
            this.list.push(item);
            this.length = this._length + 1;
            this.dispatchWidth(Event.ADDED, item);
        }

        public addItemAt(item:any, index:number) {
            index = +index & ~0;
            this.list.splice(index, 0, item);
            this.length = this._length + 1;
            this.dispatchWidth(Event.ADDED, item);
        }

        public shift():any {
            var item:any = this.list.shift();
            this.length = this._length - 1;
            this.dispatchWidth(Event.REMOVED, item);
        }

        public splice(startIndex:number, delCount:any = 0, ...args) {
            var i:number;
            delCount = +delCount & ~0;
            if (delCount <= 0) {
                for (i = 0; i < args.length; i++) {
                    this.list.splice(startIndex, 0, args[i]);
                }
                this.length = this._length + 1;
                for (i = 0; i < args.length; i++) {
                    this.dispatchWidth(Event.ADDED, args[i]);
                }
            }
            else {
                var list:Array<any> = this.list.splice(startIndex, delCount);
                this.length = this._length - delCount;
                for (i = 0; i < list.length; i++) {
                    this.dispatchWidth(Event.REMOVED, list[i]);
                }
            }
        }

        public slice(startIndex:number, end:number):flower.ArrayValue {
            return flower.ArrayValue.create(this.list.slice(startIndex, end));
        }

        public pop():any {
            var item:any = this.list.pop();
            this.length = this._length - 1;
            this.dispatchWidth(Event.REMOVED, item);
        }

        public removeAll() {
            while (this.length) {
                var item:any = this.list.pop();
                this.length = this._length - 1;
                this.dispatchWidth(Event.REMOVED, item);
            }
        }

        public removeItem(item) {
            for (var i = 0, len = this.list.length; i < len; i++) {
                if (this.list[i] == item) {
                    this.list.splice(i, 1);
                    this.length = this._length - 1;
                    this.dispatchWidth(Event.REMOVED, item);
                    break;
                }
            }
        }

        public removeItemAt(index:number) {
            index = +index & ~0;
            var item:any = this.list.splice(index, 1)[0];
            this.length = this._length - 1;
            this.dispatchWidth(Event.REMOVED, item);
        }

        public removeItemWith(key:string, value:any, key2:string = "", value2:any = null):any {
            var item:any;
            var i:number;
            if (key2 != "") {
                for (i = 0; i < this.list.length; i++) {
                    if (this.list[i][key] == value) {
                        item = this.list.splice(i, 1)[0];
                        break;
                    }
                }
            }
            else {
                for (i = 0; i < this.list.length; i++) {
                    if (this.list[i][key] == value && this.list[i][key2] == value2) {
                        item = this.list.splice(i, 1)[0];
                        break;
                    }
                }
            }
            if (!item) {
                return;
            }
            this.length = this._length - 1;
            this.dispatchWidth(Event.REMOVED, item);
            return item;
        }

        public getItemIndex(item:any):number {
            for (var i = 0, len = this.list.length; i < len; i++) {
                if (this.list[i] == item) {
                    return i;
                }
            }
            return -1;
        }

        public getItemWith(key:string, value:any, key2:string = "", value2:any = null):any {
            var i:number;
            if (key2 != "") {
                for (i = 0; i < this.list.length; i++) {
                    if (this.list[i][key] == value) {
                        return this.list[i];
                    }
                }
            }
            else {
                for (i = 0; i < this.list.length; i++) {
                    if (this.list[i][key] == value && this.list[i][key2] == value2) {
                        return this.list[i];
                    }
                }
            }
            return null;
        }

        public getItemFunction(func:any, thisObj:any, ...args):any {
            for (var i:number = 0; i < this.list.length; i++) {
                args.push(this.list[i]);
                var r:boolean = func.apply(thisObj, args);
                args.pop();
                if (r == true) {
                    return this.list[i];
                }
            }
            return null;
        }

        public getItemsWith(key:string, value:any, key2:string = "", value2:any = null):Array<any> {
            var result:Array<any> = [];
            var i:number;
            if (key2 != "") {
                for (i = 0; i < this.list.length; i++) {
                    if (this.list[i][key] == value) {
                        result.push(this.list[i]);
                    }
                }
            }
            else {
                for (i = 0; i < this.list.length; i++) {
                    if (this.list[i][key] == value && this.list[i][key2] == value2) {
                        result.push(this.list[i]);
                    }
                }
            }
            return result;
        }

        public setItemsAttributeWith(findKey:string, findValue:any, setKey:string = "", setValue:any = null) {
            for (var i:number = 0; i < this.list.length; i++) {
                if (this.list[i][findKey] == findValue) {
                    this.list[i][setKey] = setValue;
                }
            }
        }

        public getItemsFunction(func:Function, thisObj:any = null):Array<any> {
            var _arguments__:Array<any> = [];
            for (var argumentsLength = 0; argumentsLength < arguments.length; argumentsLength++) {
                _arguments__ = arguments[argumentsLength];
            }
            var result:Array<any> = [];
            var args:Array<any> = [];
            if (_arguments__.length && _arguments__.length > 2) {
                args = [];
                for (var a:number = 2; a < _arguments__.length; a++) {
                    args.push(_arguments__[a]);
                }
            }
            for (var i:number = 0; i < this.list.length; i++) {
                args.push(this.list[i]);
                var r:boolean = func.apply(thisObj, args);
                args.pop();
                if (r == true) {
                    result.push(this.list[i]);
                }
            }
            return result;
        }

        public sort() {
            var _arguments__:Array<any> = [];
            for (var argumentsLength = 0; argumentsLength < arguments.length; argumentsLength++) {
                _arguments__ = arguments[argumentsLength];
            }
            this.list.sort.apply(this.list.sort, _arguments__);
            this.dispatchWidth(Event.UPDATE);
        }

        public getItemAt(index:any):any {
            return this.list[index];
        }

        public getItemByValue(value:any):any {
            if (this.key == "") {
                return null;
            }
            for (var i:number = 0; i < this.list.length; i++) {
                if (this.list[i][this.key] == value) {
                    return this.list[i];
                }
            }
            return null;
        }

        public getItemByRange(value:any):any {
            if (this.key == "" || this.rangeMinKey == "" || this.rangeMaxKey == "") {
                return null;
            }
            for (var i:number = 0; i < this.list.length; i++) {
                var min:number = this.list[i][this.rangeMinKey];
                var max:number = this.list[i][this.rangeMaxKey];
                if (value >= min && value <= max) {
                    return this.list[i];
                }
            }
            return null;
        }

        public getItemsByRange(value:any):Array<any> {
            if (this.key == "" || this.rangeMinKey == "" || this.rangeMaxKey == "") {
                return null;
            }
            var list:Array<any> = [];
            for (var i:number = 0; i < this.list.length; i++) {
                var min:number = this.list[i][this.rangeMinKey];
                var max:number = this.list[i][this.rangeMaxKey];
                if (value >= min && value <= max) {
                    list.push(this.list[i]);
                }
            }
            return list;
        }

        public set key(val:string) {
            this._key = val;
        }

        public get key():string {
            return this._key;
        }

        public set rangeMinKey(val:string) {
            this._rangeMinKey = val;
        }

        public get rangeMinKey():string {
            return this._rangeMinKey;
        }

        public set rangeMaxKey(val:string) {
            this._rangeMaxKey = val;
        }

        public get rangeMaxKey():string {
            return this._rangeMaxKey;
        }

        public get length():number {
            return this._length;
        }

        public set length(val:number) {
            val = +val & ~0;
            if (this._length == val) {
                return;
            }
            else {
                if (val == this.list.length) {
                    this._length = val;
                    this.dispatchWidth("length");
                    this.dispatchWidth("update");
                }
                else {
                    while (this.list.length > val) {
                        this.pop();
                    }
                }
            }
        }

        public dispose() {
            this.list = [];
            this._length = 0;
            super.dispose();
        }

        public static pool:Array<flower.ArrayValue> = new Array<flower.ArrayValue>();

        public static create(initValue:Array<any> = null):flower.ArrayValue {
            var value:flower.ArrayValue;
            if (flower.ArrayValue.pool.length) {
                value = flower.ArrayValue.pool.pop();
                value.list = value.list || [];
                value._length = value.list.length;
            }
            else {
                value = new flower.ArrayValue(initValue);
            }
            return value;
        }

        public static release(array:flower.ArrayValue) {
            array.dispose();
            flower.ArrayValue.pool.push(array);
        }

    }
}
