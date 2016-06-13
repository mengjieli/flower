module flower {
    export class DisplayObject extends flower.EventDispatcher {
        private _id:number;
        public _x:number = 0;
        public _y:number = 0;
        public _width:number = 0;
        public _height:number = 0;
        public _alpha:number = 1;
        public _parentAlpha:number = 1;
        public _visible:boolean = true;
        public _touchEnabled:boolean = true;
        public _mutiplyTouchEnabled:boolean = true;
        public _parent:flower.Sprite|Mask;
        public _touchX:number = 0;
        public _touchY:number = 0;
        public _DisplayObject:any;
        public _displayFlags:number;
        public _stage:flower.Stage;
        public _nestLevel:number = 0;
        public _nativeClass:string;
        public _show:any;
        public static showProperty:any;

        public constructor() {
            super();
            this._id = flower.DisplayObject.id++;
            this._displayFlags = 0;
            this._DisplayObject = {0: 1, 1: 1, 2: 0, 3: 0, 4: 0, 5: ""};
        }

        public $addFlag(pos:number) {
            this._displayFlags |= pos;
        }

        public $removeFlag(pos:number) {
            this._displayFlags &= ~pos;
        }

        public $getFlag(pos:number):boolean {
            return this._displayFlags & pos ? true : false;
        }

        public $propagateFlagsUp(flags:number) {
            if (this.$getFlag(flags)) {
                return;
            }
            this.$addFlag(flags);
            var parent:any = this._parent;
            if (parent) {
                parent.$propagateFlagsUp(flags);
            }
        }

        public $setParent(parent:flower.Sprite) {
            var p:flower.DisplayObjectContainer = this._parent;
            this._parent = parent;
            if (parent) {
                this._parent["$nativeShow"].addChild(this._show);
                this.dispatchWidth(flower.Event.ADDED);
            }
            else {
                p["$nativeShow"].removeChild(this._show);
                this.dispatchWidth(flower.Event.REMOVED);
            }
        }

        public $stageFlag = false;
        public $onAddToStage(stage:flower.Stage, nestLevel:number) {
            if(this.$stageFlag) {
                return;
            }
            if (stage == null) {
                this._stage = null;
                this._nestLevel = null;
            } else {
                if (this._stage == null) {
                    this._stage = stage;
                    this._nestLevel = nestLevel;
                    this.dispatchWidth(flower.Event.ADDED_TO_STAGE);
                } else {
                    this._stage = stage;
                    this._nestLevel = nestLevel;
                }
            }
        }

        public $onRemoveFromStage() {
            if(this.$stageFlag) {
                return;
            }
            if (this._stage) {
                this._stage = null;
                this._nestLevel = 0;
                this.dispatchWidth(flower.Event.REMOVED_FROM_STAGE);
            }
        }

        public _setX(val:number, offX:number = 0) {
            this._x = val;
            var p:any = flower.DisplayObject.showProperty.x;
            if (p.func) {
                this._show[p.func].apply(this._show, [this._x + offX]);
            }
            else {
                this._show[p.atr] = this._x + offX;
            }
            this.$addFlag(0x200);
            this.$propagateFlagsUp(DisplayObjectFlag.DISPLAYOBJECT_CONTAINER_SIZE);
        }

        public _setY(val:number, offY:number = 0) {
            this._y = val;
            var p:any = flower.DisplayObject.showProperty.y;
            if (p.func) {
                this._show[p.func].apply(this._show, [System.receverY ? -this.y - offY : this._y + offY]);
            }
            else {
                this._show[p.atr] = this._y + offY;
            }
            this.$addFlag(0x200);
            this.$propagateFlagsUp(4);
        }

        public _setScaleX(val:number) {
            this._DisplayObject[0] = val;
            var p:any = flower.DisplayObject.showProperty.scaleX;
            if (p.func) {
                this._show[p.func].apply(this._show, [this._DisplayObject[0]]);
            }
            else {
                this._show[p.atr] = this._DisplayObject[0];
            }
            this.$addFlag(0x200);
            this.$propagateFlagsUp(4);
        }

        public _setScaleY(val:number) {
            this._DisplayObject[1] = val;
            var p:any = flower.DisplayObject.showProperty.scaleY;
            if (p.func) {
                this._show[p.func].apply(this._show, [this._DisplayObject[1]]);
            }
            else {
                this._show[p.atr] = this._DisplayObject[1];
            }
            this.$addFlag(0x200);
            this.$propagateFlagsUp(4);
        }

        public _setRotation(val:number) {
            this._DisplayObject[4] = val;
            var p:any = flower.DisplayObject.showProperty.rotation;
            if (p.func) {
                this._show[p.func].apply(this._show, [this._DisplayObject[4] * p.scale]);
            }
            else {
                this._show[p.atr] = this._DisplayObject[4] * p.scale;
            }
            this.$addFlag(0x200);
            this.$propagateFlagsUp(4);
        }

        public _setAlpha(val:number) {
            if (this._alpha == val) {
                return;
            }
            this._alpha = val;
            this._alphaChange();
        }

        public _alphaChange() {
            var p:any = flower.DisplayObject.showProperty.alpha;
            if (p.func) {
                this._show[p.func].apply(this._show, [this._alpha * this._parentAlpha * p.scale]);
            }
            else {
                this._show[p.atr] = this._alpha * this._parentAlpha * p.scale;
            }
        }

        public _setParentAlpha(val:number) {
            if (this._parentAlpha == val) {
                return;
            }
            this._parentAlpha = val;
            this._alphaChange();
        }

        public _setWidth(val:number) {
            this._width = val;
        }

        public _setHeight(val:number) {
            this._height = val;
        }

        public _getMouseTarget(matrix:flower.Matrix, mutiply:boolean):flower.DisplayObject {
            if (this.touchEnabled == false || this._visible == false)
                return null;
            matrix.save();
            matrix.translate(-this._x, -this._y);
            if (this.rotation)
                matrix.rotate(-this.radian);
            if (this.scaleX != 1 || this.scaleY != 1)
                matrix.scale(1 / this.scaleX, 1 / this.scaleY);
            this._touchX = matrix.tx;
            this._touchY = matrix.ty;
            if (this._touchX >= 0 && this._touchY >= 0 && this._touchX < this.width && this._touchY < this.height) {
                return this;
            }
            matrix.restore();
            return null;
        }

        public $getSize() {
        }

        public $onFrameEnd() {
        }

        public dispatch(event:flower.Event) {
            super.dispatch(event);
            if (event.bubbles && !event.isPropagationStopped && this._parent) {
                this._parent.dispatch(event);
            }
        }

        public dispose() {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            super.dispose();
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.alpha = 1;
            this.visible = true;
            this.rotation = 0;
        }

        public get id():number {
            return this._id;
        }

        public get nativeClass():string {
            return this._nativeClass;
        }

        public get name():string {
            return this._DisplayObject[5];
        }

        public set name(value:string) {
            this._DisplayObject[5] = value;
        }

        public get x():number {
            return this._x;
        }

        public set x(val:number) {
            val = +val || 0;
            if (this._x == val) {
                return;
            }
            this._setX(val);
        }

        public get y():number {
            return this._y;
        }

        public set y(val:number) {
            val = +val || 0;
            if (this._y == val) {
                return;
            }
            this._setY(val);
        }

        public get width():number {
            if (this.$getFlag(1)) {
                this.$getSize();
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
            return this._height;
        }

        public set height(val:number) {
            val = +val & ~0;
            if (this._height == val) {
                return;
            }
            this._setHeight(val);
        }

        public get scaleX():number {
            return this._DisplayObject[0];
        }

        public set scaleX(val:number) {
            val = +val || 0;
            if (this._DisplayObject[0] == val) {
                return;
            }
            this._setScaleX(val);
        }

        public get scaleY():number {
            return this._DisplayObject[1];
        }

        public set scaleY(val:number) {
            val = +val || 0;
            if (this._DisplayObject[1] == val) {
                return;
            }
            this._setScaleY(val);
        }

        public get rotation():number {
            return this._DisplayObject[4];
        }

        public set rotation(val:number) {
            val = +val || 0;
            this._setRotation(val);
        }

        public get radian():number {
            return this._DisplayObject[4] * Math.PI / 180;
        }

        public get alpha():number {
            return this._alpha;
        }

        public set alpha(val:number) {
            val = +val || 0;
            if (val < 0) {
                val = 0;
            }
            if (val > 1) {
                val = 1;
            }
            this._setAlpha(val);
        }

        public get $parentAlpha():number {
            return this._parentAlpha;
        }

        public set $parentAlpha(val:number) {
            this._setParentAlpha(val);
        }

        public get visible():boolean {
            return this._visible;
        }

        public set visible(val:boolean) {
            this._visible = !!val;
            var p:any = flower.DisplayObject.showProperty.visible;
            if (p.func) {
                this._show[p.func].apply(this._show, [this._visible]);
            }
            else {
                this._show[p.atr] = this._visible;
            }
        }

        public get touchEnabled():boolean {
            return this._touchEnabled;
        }

        public set touchEnabled(val:boolean) {
            this._touchEnabled = !!val;
        }

        public get mutiplyTouchEnabled():boolean {
            return this._mutiplyTouchEnabled;
        }

        public set mutiplyTouchEnabled(val:boolean) {
            this._mutiplyTouchEnabled = !!val;
        }

        public get touchX():number {
            return this._touchX;
        }

        public get touchY():number {
            return this._touchY;
        }

        public get parent():flower.DisplayObjectContainer {
            return this._parent;
        }

        public get stage():flower.Stage {
            return this._stage;
        }

        public get disposeFlag():boolean {
            return this.$getFlag(1);
        }

        public get $nativeShow():any {
            return this._show;
        }

        public static id:number;
    }
}

flower.DisplayObject.showProperty = System.DisplayObject;
flower.DisplayObject.id = 0;
