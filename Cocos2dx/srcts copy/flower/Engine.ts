module flower {
    export class Engine extends flower.Stage {
        private debugStage:flower.DebugStage;
        private ready:boolean = false;

        public constructor() {
            super();
            if (flower.Engine.ist) {
                return;
            }
            flower.Engine.ist = this;
            this.debugStage = new flower.DebugStage();
            System.start(this._show, this.debugStage.$nativeShow, this);
            flower.Engine.global = System.global;
            flower.JSON.parser = System.JSON_parser;
            flower.JSON.stringify = System.JSON_stringify;
            System.runTimeLine(flower.Time.$run);
            this._width = System.width;
            this._height = System.height;
            FlowerData.ist.init();
            DataManager.ist.flower.system.screen.width.value = this._width;
            DataManager.ist.flower.system.screen.height.value = this._height;
            var loader:flower.URLLoader = new flower.URLLoader("res/blank.png");
            loader.addListener(flower.Event.COMPLETE, this.onLoadBlankComplete, this);
        }

        private onLoadBlankComplete(e:flower.Event) {
            flower.Texture2D.blank = e.data;
            var image:flower.Image = new flower.Image(e.data);
            this.ready = true;
            this.dispatchWidth(flower.Event.READY);
        }

        public showDebugTool() {
            this.debugStage.show();
        }

        public hideDebugTool() {
            this.debugStage.hide();
        }

        public $onFrameEnd() {
            super.$onFrameEnd();
            this.debugStage.$onFrameEnd();
        }

        public getMouseTarget(touchX:number, touchY:number, mutiply:boolean):flower.DisplayObject {
            var target:flower.DisplayObject = this.debugStage.getMouseTarget(touchX, touchY, mutiply);
            if (target == this.debugStage) {
                target = super.getMouseTarget(touchX, touchY, mutiply);
            }
            return target;
        }

        public _setX(val:number) {
            flower.DebugInfo.debug("|类Engine| set x 不能设置其位置", flower.DebugInfo.ERROR);
            return;
        }

        public _setY(val:number) {
            flower.DebugInfo.debug("|类Engine| set y 不能设置其位置", flower.DebugInfo.ERROR);
            return;
        }

        public get isReady():boolean {
            return this.ready;
        }

        public clear() {
            while (this.numChildren) {
                this.getChildAt(0).dispose();
            }
            flower.URLLoader.clear();
            flower.DataManager.ist.clear();
        }

        public static DEBUG:boolean;
        public static TIP:boolean;
        public static global:any;
        public static ist:flower.Engine;

        public static getInstance():flower.Engine {
            return flower.Engine.ist;
        }

    }
}

flower.Engine.DEBUG = true;
flower.Engine.TIP = true;
