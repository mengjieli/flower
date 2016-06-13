module flower {
    export class TextField extends flower.DisplayObject {
        public static textFieldProperty:any;
        protected _TextField:any;

        public constructor() {
            super();
            this._TextField = {0: 12, 1: 0, 2: "", 3: 0, 4: 0, 5: false, 6: true, 7: true};
            this._show = System.getNativeShow("TextField");
            //this.width = 100;
            //this.height = 100;
            this._setSize(this._TextField[0]);
            this._setColor(this._TextField[1]);
            this._nativeClass = "TextField";
        }

        private _setSize(val:number) {
            this._TextField[0] = val;
            var p:any = flower.TextField.textFieldProperty.size;
            if (p.atr) {
                this._show[p.atr] = val;
            }
            else if (p.func) {
                this._show[p.func].apply(this._show, [val]);
            }
            else if (p.exe) {
                p.exe(this._show, val);
            }
            this._invalidateNativeText();
        }

        private _setColor(val:number) {
            this._TextField[1] = val;
            var p:any = flower.TextField.textFieldProperty.color;
            if (p.atr) {
                this._show[p.atr] = val;
            }
            else if (p.func) {
                this._show[p.func].apply(this._show, [val]);
            }
            else if (p.exe) {
                p.exe(this._show, val);
            }
        }

        protected _setText(val:string) {
            this._TextField[2] = val;
            this._invalidateNativeText();
        }

        public _setWidth(val:number) {
            this._width = +val & ~0;
            this._invalidateNativeText();
        }

        public _setHeight(val:number) {
            this._height = +val & ~0;
            this._invalidateNativeText();
        }

        public _setNativeText() {
            var p:any = flower.TextField.textFieldProperty.resetText;
            p(this._show, this._TextField[2], this._width, this._height, this._TextField[0], this._TextField[5], this._TextField[6], this._TextField[7]);
            p = flower.TextField.textFieldProperty.mesure;
            var size:any = p(this._show);
            this._TextField[3] = size.width;
            this._TextField[4] = size.height;
            this.$removeFlag(2);
            this.$addFlag(0x200);
            this.$propagateFlagsUp(4);
        }

        public $isMouseTarget(matrix:flower.Matrix, mutiply:boolean):boolean {
            if (this.touchEnabled == false || this.visible == false)
                return false;
            matrix.save();
            matrix.translate(-this._x, -this._y);
            if (this.rotation)
                matrix.rotate(-this.radian);
            if (this.scaleX != 1 || this.scaleY != 1)
                matrix.scale(1 / this.scaleX, 1 / this.scaleY);
            this._touchX = matrix.tx;
            this._touchY = matrix.ty;
            if (this._touchX >= 0 && this._touchY >= 0 && this._touchX < this._TextField[3] && this._touchY < this._TextField[4]) {
                return true;
            }
            matrix.restore();
            return false;
        }

        public _invalidateNativeText() {
            this.$addFlag(1);
            if (!this.$getFlag(2)) {
                this.$addFlag(0x2);
            }
        }

        public $getSize() {
            if (this.$getFlag(2)) {
                this._setNativeText();
            }
            this.$removeFlag(1);
        }

        public $onFrameEnd() {
            if (this.$getFlag(2)) {
                this._setNativeText();
            }
        }

        public dispose() {
            var show:any = this._show;
            super.dispose();
            this.text = "";
            System.cycleNativeShow("TextField", show);
        }

        public get size():number {
            return this._TextField[0];
        }

        public set size(val:number) {
            this._setSize(+val || 0);
        }

        public get color():number {
            return this._TextField[1];
        }

        public set color(val:number) {
            this._setColor(+val || 0);
        }

        public get text():string {
            return this._TextField[2];
        }

        public set text(val:string) {
            val = val + "";
            if (val == this._TextField[2]) {
                return;
            }
            this._setText(val);
        }

        public get textWidth():number {
            return this._TextField[3];
        }

        public get textHeight():number {
            return this._TextField[4];
        }

        public get wordWrap():boolean {
            return this._TextField[5];
        }

        public set wordWrap(val:boolean) {
            val = !!val;
            if (val == this._TextField[5]) {
                return;
            }
            this._TextField[5] = val;
            this._invalidateNativeText();
        }

        public get multiline():boolean {
            return this._TextField[6];
        }

        public set multiline(val:boolean) {
            val = !!val;
            if (val == this._TextField[6]) {
                return;
            }
            this._TextField[6] = val;
            this._invalidateNativeText();
        }

        public get width():number {
            if (this.$getFlag(1)) {
                this.$getSize();
            }
            if (this._TextField[7] == true) {
                return this._TextField[3];
            }
            return this._width;
        }

        public set width(val:number) {
            val = +val & ~0;
            if (this._width == val) {
                return;
            }
            this._setWidth(val);
        }

        public get height():number {
            if (this.$getFlag(1)) {
                this.$getSize();
            }
            if (this._TextField[7] == true) {
                return this._TextField[4];
            }
            return this._height;
        }

        public set height(val:number) {
            val = +val & ~0;
            if (this._height == val) {
                return;
            }
            this._setHeight(val);
        }

        public get autoSize():boolean {
            return this._TextField[7];
        }

        public set autoSize(val:boolean) {
            val = !!val;
            if (val == this._TextField[7]) {
                return;
            }
            this._TextField[7] = val;
            this._invalidateNativeText();
        }
    }
}

flower.TextField.textFieldProperty = System.TextField;
