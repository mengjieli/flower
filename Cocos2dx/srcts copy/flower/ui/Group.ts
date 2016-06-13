module flower {
    export class Group extends flower.Sprite implements flower.UIComponent {

        public constructor() {
            super();
            flower.Component.init(this);
        }

        public $onFrameEnd() {
            this.resetUIProperty();
            super.$onFrameEnd();
            this.resetLayout();
        }

        public dispose() {
            this.layout = null;
            for (var key in this._binds) {
                this._binds[key].dispose();
            }
            this._binds = null;
            super.dispose();
        }

        //////////////////////////////////interface//////////////////////////////////
        public layout;
        private _binds;
        public eventThis;
        public onAdded;
        public absoluteState;
        public state;
        public currentState;
        public topAlgin;
        public bottomAlgin;
        public leftAlgin;
        public rightAlgin;
        public horizontalCenterAlgin;
        public verticalCenterAlgin;
        public top;
        public bottom;
        public left;
        public right;
        public horizontalCenter;
        public verticalCenter;
        public percentWidth;
        public percentHeight;

        public bindProperty(property:string, content:string, checks:Array<any> = null) {
        }

        public removeBindProperty(property:string) {
        }

        public setStatePropertyValue(property:string, state:string, val:string, checks:Array<any> = null) {

        }

        public changeState(state:string):string {
            return "";
        }

        protected resetUIProperty():void {

        }

        protected resetLayout():void {

        }

        //////container//////
        protected addUIEvents() {
        }

        public addChild(child:flower.DisplayObject) {
            super.addChild(child);
            if (child.nativeClass == "UI") {
                if (!child["absoluteState"]) {
                    child["currentState"] = this.currentState;
                }
            }
            if (this.layout) {
                this.layout.addElementAt(child, this.numChildren - 1);
            }
        }

        public addChildAt(child:flower.DisplayObject, index:number = 0) {
            super.addChildAt(child, index);
            if (child.nativeClass == "UI") {
                if (!child["absoluteState"]) {
                    child["currentState"] = this.currentState;
                }
            }
            if (this.layout) {
                this.layout.addElementAt(child, index);
            }
        }

        public removeChild(child:flower.DisplayObject) {
            super.removeChild(child);
            if (this.layout) {
                this.layout.removeElement(child);
            }
        }

        public removeChildAt(index:number) {
            super.removeChildAt(index);
            if (this.layout) {
                this.layout.removeElementAt(index);
            }
        }

        public setChildIndex(child:flower.DisplayObject, index:number) {
            super.setChildIndex(child, index);
            if (this.layout) {
                this.layout.setEelementIndex(child, index);
            }
        }
    }
    flower.Component.register(Group, true);
}

