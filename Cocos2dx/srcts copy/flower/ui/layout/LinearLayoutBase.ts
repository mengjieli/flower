module flower {
    export class LinearLayoutBase extends flower.Layout {

        private _gap:number = 0;
        private _algin:string = "";
        private _maxX:number;
        private _maxY:number;

        public constructor() {
            super();
            this._fixElementSize = true;
        }

        public  isElementsOutSize(startX:number, starY:number, width:number, height:number):boolean {
            if (this._algin == flower.Layout.VerticalAlign) {
                if (starY + height <= this._maxY) {
                    return true;
                }
            }
            if (this._algin == flower.Layout.HorizontalAlign) {
                if (startX + width <= this._maxX) {
                    return true;
                }
            }
            return false;
        }

        public getFirstItemIndex(elementWidth:number, elementHeight:number, startX:number, startY:number):number {
            if (this._algin == flower.Layout.VerticalAlign) {
                return Math.floor(startY / (elementHeight + this._gap));
            } else if (this._algin == flower.Layout.HorizontalAlign) {
                return Math.floor(startX / (elementWidth + this._gap));
            }
            return 0;
        }

        public getContentSize():flower.Size {
            var size = flower.Size.create(0, 0);
            if (!this.elements.length) {
                return size;
            }
            var minX = this.elements[0].x;
            var maxX = this.elements[0].x + this.elements[0].width;
            var minY = this.elements[0].y;
            var maxY = this.elements[0].y + this.elements[0].height;
            var element;
            for (var i = 1; i < this.elements.length; i++) {
                element = this.elements[i];
                minX = element.x < minX ? element.x : minX;
                maxX = element.x + element.width > maxX ? element.x + element.width : maxX;
                minY = element.y < minY ? element.y : minY;
                maxY = element.y + element.height > maxY ? element.y + element.height : maxY;
            }
            size.width = maxX - minX;
            size.height = maxY - minY;
            return size;
        }

        public mesureSize(elementWidth:number, elementHeight:number, elementCount:number):flower.Size {
            var size = flower.Size.create(elementWidth, elementHeight);
            if (this.elements.length) {
                if (this._fixElementSize) {
                    if (this._algin == flower.Layout.VerticalAlign) {
                        size.height = elementCount * (elementHeight + this._gap);
                    } else if (this._algin == flower.Layout.HorizontalAlign) {
                        size.width = elementCount * (elementWidth + this._gap);
                    }
                }
            }
            return size;
        }

        public updateList(width:number, height:number, startIndex:number = 0) {
            if (!this.flag) {
                return;
            }
            var list:Array<any> = this.elements;
            var len:number = list.length;
            if (!len) {
                return;
            }
            this._maxX = 0;
            this._maxY = 0;
            var i:number;
            if (this._algin == flower.Layout.VerticalAlign) {
                if (this._fixElementSize) {
                    var eh:number = list[0].height;
                    for (i = 0; i < len; i++) {
                        list[i].y = (i + startIndex) * (eh + this._gap);
                    }
                    this._maxY = (len + startIndex) * (eh + this._gap);
                }
                else {
                    var y:number = 0;
                    for (i = 0; i < len; i++) {
                        list[i].y = y;
                        y += list[i].height + this._gap;
                        this._maxY = y;
                    }
                }
            }
            if (this._algin == flower.Layout.HorizontalAlign) {
                if (this._fixElementSize) {
                    var ew:number = list[0].width;
                    for (i = 0; i < len; i++) {
                        list[i].x = (i + startIndex) * (ew + this._gap);
                    }
                    this._maxX = (len + startIndex) * (ew + this._gap);
                }
                else {
                    var x:number = 0;
                    for (i = 0; i < len; i++) {
                        list[i].x = x;
                        x += list[i].width + this._gap;
                        this._maxX = x;
                    }
                }
            }
        }

        public get gap():number {
            return this._gap;
        }

        public set gap(val:number) {
            val = +val || 0;
            this._gap = val;
        }

        public get algin():string {
            return this._algin;
        }

        public set algin(val:string) {
            this._algin = val;
        }

    }
}

