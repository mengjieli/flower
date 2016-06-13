module flower {
    export class RectUI extends Shape {

        public constructor() {
            super();
            this._width = 1;
            this._height = 1;
            this.drawRect = null;
            flower.Component.init(this);
        }

        protected _setFillColor(val:number) {
            super._setFillColor(val);
            this.$addFlag(1);
        }

        public get lineWidth():number {
            return 0;
        }

        public set lineWidth(val:number) {
        }

        public _setWidth(val:number) {
            this._width = val;
            this.$addFlag(1);
        }

        public _setHeight(val:number) {
            this._height = val;
            this.$addFlag(1);
        }

        public $onFrameEnd() {
            if (this.$getFlag(1)) {
                var width = this._width;
                var height = this._height;
                this.clear();
                if (width && height) {
                    super.drawRect(0, 0, width, height);
                    this.$removeFlag(1);
                }
            }
            super.$onFrameEnd.call(this);
            this.resetUIProperty();
        }
        //////////////////////////////////interface//////////////////////////////////
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
    }
    flower.Component.register(RectUI);
}