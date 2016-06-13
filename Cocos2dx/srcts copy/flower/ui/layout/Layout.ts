module flower {
    export class Layout {

        protected _fixElementSize:boolean = false;
        protected elements:Array<any> = [];
        protected flag:boolean = false;

        public constructor() {
        }

        public  isElementsOutSize(startX:number, starY:number, width:number, height:number):boolean {
            return false;
        }

        public getFirstItemIndex(elementWidth:number, elementHeight:number, startX:number, startY:number):number {
            return 0;
        }

        public getContentSize():flower.Size {
            return null;
        }

        public mesureSize(elementWidth:number, elementHeight:number, elementCount:number):flower.Size {
            return null;
        }

        public addElementAt(element:flower.DisplayObject, index:number) {
            var len:number = this.elements.length;
            for (var i:number = 0; i < len; i++) {
                if (this.elements[i] == element) {
                    this.elements.splice(i, 1);
                    break;
                }
            }
            this.elements.splice(index, 0, element);
            this.flag = true;
        }

        public setEelementIndex(element:flower.DisplayObject, index:number) {
            var len:number = this.elements.length;
            for (var i:number = 0; i < len; i++) {
                if (this.elements[i] == element) {
                    this.elements.splice(i, 1);
                    break;
                }
            }
            this.elements.splice(index, 0, element);
            this.flag = true;
        }

        public removeElement(element:flower.DisplayObject) {
            var len:number = this.elements.length;
            for (var i:number = 0; i < len; i++) {
                if (this.elements[i] == element) {
                    this.elements.splice(i, 1);
                    break;
                }
            }
            this.flag = true;
        }

        public removeElementAt(index:number) {
            this.elements.splice(index, 1);
            this.flag = true;
        }

        public $setFlag() {
            this.flag = true;
        }

        public updateList(width:number, height:number, startIndex:number = 0) {
        }

        public $clear() {
            this.elements = [];
            this.flag = false;
        }

        public get fixElementSize():boolean {
            return this._fixElementSize;
        }

        public set fixElementSize(val:boolean) {
            this._fixElementSize = !!val;
        }

        public static VerticalAlign:string;
        public static HorizontalAlign:string;
        public static NoneAlgin:string;
    }
}

flower.Layout.VerticalAlign = "vertical";
flower.Layout.HorizontalAlign = "horizontal";
flower.Layout.NoneAlgin = "";
