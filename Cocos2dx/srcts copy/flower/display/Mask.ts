module flower {

    export class Mask extends flower.DisplayObject implements flower.DisplayObjectContainer {

        protected _shape:flower.Shape;

        public constructor() {
            super();
            this._show = System.getNativeShow("Mask");
            this._nativeClass = "Mask";
            flower.Container.init(this);
            this._shape = new flower.Shape();
            System.Mask.init(this._show, this._shape._show);
        }

        public set shape(val:flower.Shape) {
            if (val == null) {
                if (flower.Engine.DEBUG) {
                    flower.DebugInfo.debug("Mask.shape 不能设置为空", flower.DebugInfo.WARN);
                }
                return;
            }
            this._shape.dispose();
            this._shape = val;
            this._shape._parent = this;
            System.Mask.init(this._show, this._shape._show);
        }

        public get shape():flower.Shape {
            return this._shape;
        }

        public dispose():void {
            var show:any = this._show;
            var childs = this["_childs"];
            while (childs.length) {
                childs[0].dispose();
            }
            if (this.parent) {
                this.parent.removeChild(this);
            }
            System.cycleNativeShow("Mask", show);
        }
        //////////////////////////////////interface//////////////////////////////////
        public $onFrameEnd() {
            if (this.$getFlag(0x4)) {
                this["_resetChildIndex"]();
            }
            this._shape.$onFrameEnd();
            var childs = this["_childs"];
            for (var i:number = 0, len:number = childs.length; i < len; i++) {
                childs[i].$onFrameEnd();
            }
        }


        public $onAddToStage(stage:flower.Stage, nestLevel:number) {
            super.$onAddToStage(stage, nestLevel);
            if (this.$stageFlag == true) {
                return;
            }
            var childs = this._childs;
            var flag = true;
            while (flag) {
                flag = false;
                var len:number = childs.length;
                for (var i:number = len - 1; i >= 0; i--) {
                    var child = childs[i];
                    if (!child.stage) {
                        child.$onAddToStage(this.stage, this._nestLevel + 1);
                        flag = true;
                    }
                }
            }
        }

        public $onRemoveFromStage() {
            super.$onRemoveFromStage();
            if (this.$stageFlag == true) {
                return;
            }
            var childs = this._childs;
            var flag = true;
            while (flag) {
                flag = false;
                var len:number = childs.length;
                for (var i:number = len - 1; i >= 0; i--) {
                    var child = childs[i];
                    if (child.stage) {
                        child.$onRemoveFromStage();
                        flag = true;
                    }
                }
            }
        }

        public _getMouseTarget(matrix:flower.Matrix, mutiply:boolean):flower.DisplayObject {
            return null;
        }

        public addChild(child:flower.DisplayObject) {

        }

        public getChildAt(index:number):flower.DisplayObject {
            return null;
        }

        public addChildAt(child:flower.DisplayObject, index?:number) {

        }

        public removeChild(child:flower.DisplayObject) {

        }

        public removeChildAt(index:number) {

        }

        public removeAll() {

        }

        public setChildIndex(child:flower.DisplayObject, index:number) {

        }

        public getChildIndex(child:flower.DisplayObject):number {
            return -1;
        }

        public contains(child:flower.DisplayObject):boolean {
            return false;
        }

        public sortChild(key:string,opt:number):void {

        }

        private _childs;
        public mesureWidth:number;
        public mesureHeight:number;
        public numChildren:number;
    }

    flower.Container.register(Mask,true);
}