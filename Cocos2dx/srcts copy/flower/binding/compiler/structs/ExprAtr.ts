module flower {
    export class ExprAtr {
        public type:string = "attribute";
        public list:Array<flower.ExprAtrItem>;
        private value:flower.Value;
        private before:any;
        private beforeClass:boolean;
        private equalBefore:boolean;

        public constructor() {
            this.list = new Array<flower.ExprAtrItem>();
            this.equalBefore = false;
        }

        public addItem(item:flower.ExprAtrItem) {
            if (this.list.length == 0 && item.type == "id" && item.val == "this") {
                return;
            }
            if (this.list.length == 0 && item.type == ".") {
                item.type = "id";
            }
            this.list.push(item);
        }

        public checkPropertyBinding(commonInfo:any) {
            var atr:any;
            if (this.list[0].type == "()") {
                (<flower.Expr>this.list[0].val).checkPropertyBinding(commonInfo);
            }
            else if (this.list[0].type == "object") {
                (<flower.ObjectAtr>this.list[0].val).checkPropertyBinding(commonInfo);
            }
            else if (this.list[0].type == "id") {
                var name:string = this.list[0].val;
                if (name == "this") {
                    this.list.shift();
                }
                if (commonInfo.objects["this"][name] != null) {
                    atr = commonInfo.objects["this"][name];
                    this.before = commonInfo.objects["this"];
                } else if (commonInfo.objects[name] != null) {
                    this.before = commonInfo.objects[name];
                    this.beforeClass = false;
                    this.equalBefore = true;
                }
                else if (commonInfo.classes[name] != null) {
                    this.before = commonInfo.classes[name];
                    this.beforeClass = true;
                    this.equalBefore = true;
                }
                else if (commonInfo.checks) {
                    for (var c:number = 0; c < commonInfo.checks.length; c++) {
                        try {
                            atr = commonInfo.checks[c][name];
                            if (atr) {
                                this.before = commonInfo.checks[c];
                            }
                        }
                        catch (e) {
                            atr = null;
                            this.before = null;
                        }

                        if (atr) {
                            break;
                        }
                    }
                }
            }
            for (var i:number = 1; i < this.list.length; i++) {
                if (this.list[i].type == ".") {
                    if (atr) {
                        var atrName:string = this.list[i].val;
                        try {
                            atr = atr[atrName];
                        }
                        catch (e) {
                            atr = null;
                        }

                    }
                }
                else if (this.list[i].type == "call") {
                    atr = null;
                    this.list[i].val.checkPropertyBinding(commonInfo);
                }
            }
            if (atr && atr instanceof flower.Value) {
                this.value = atr;
                commonInfo.result.push(atr);
            }
        }

        public getValue():any {
            if (this.value) {
                return this.value.value;
            }
            var atr:any;
            var lastAtr:any = null;
            if (this.list[0].type == "()") {
                atr = (<flower.Expr>this.list[0].val).getValue();
            }
            else if (this.list[0].type == "object") {
                atr = (<flower.ObjectAtr>this.list[0].val).getValue();
            }
            else if (this.list[0].type == "id") {
                atr = this.before;
                lastAtr = this.before;
                if (!this.equalBefore) {
                    try {
                        atr = atr[this.list[0].val];
                    }
                    catch (e) {
                        return null;
                    }

                }
            }
            for (var i:number = 1; i < this.list.length; i++) {
                try {
                    if (this.list[i].type == ".") {
                        atr = atr[this.list[i].val];
                    }
                    else if (this.list[i].type == "call") {
                        if (i == 2 && this.beforeClass) {
                            atr = atr.apply(null, (<flower.CallParams>this.list[i].val).getValueList());
                        }
                        else {
                            atr = atr.apply(lastAtr, (<flower.CallParams>this.list[i].val).getValueList());
                        }
                    }
                    if (i < this.list.length - 1 && this.list[i + 1].type == "call") {
                        continue;
                    }
                    lastAtr = atr;
                }
                catch (e) {
                    return null;
                }

            }
            return atr;
        }

        public print():string {
            var content:string = "";
            for (var i:number = 0; i < this.list.length; i++) {
                content += this.list[i].val;
            }
            return content;
        }

    }
}

