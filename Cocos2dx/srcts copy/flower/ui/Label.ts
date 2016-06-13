module flower {
    export class Label extends flower.TextField implements flower.UIComponent {

        public static theme = {

        }

        private _updateFlag:boolean = true;

        public constructor() {
            super();
            flower.Component.init(this);
            for(var key in Label.theme) {
                this[key] = Label.theme[key];
            }
        }

        public _setNativeText() {
            super._setNativeText();
            this.$addFlag(0x200);
        }

        public $onFrameEnd() {
            super.$onFrameEnd.call(this);
            this.resetUIProperty();
        }

        public dispose() {
            for (var key in this._binds) {
                this._binds[key].dispose();
            }
            this._binds = null;
            super.dispose();
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
    flower.Component.register(Label);
}

