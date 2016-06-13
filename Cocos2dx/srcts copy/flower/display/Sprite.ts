module flower {
    export class Sprite extends flower.DisplayObject implements flower.DisplayObjectContainer {

        public constructor() {
            super();
            this._show = System.getNativeShow("DisplayObjectContainer");
            this._nativeClass = "DisplayObjectContainer";
            flower.Container.init(this);
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
            System.cycleNativeShow("DisplayObjectContainer", show);
        }

        //////////////////////////////////interface//////////////////////////////////
        public $onFrameEnd() {
            if (this.$getFlag(0x4)) {
                this["_resetChildIndex"]();
            }
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

    flower.Container.register(Sprite);
}

