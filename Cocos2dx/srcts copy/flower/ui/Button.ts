module flower {
    export class Button extends flower.Group {

        private _enabled:boolean = true;

        public constructor() {
            super();
            this.absoluteState = true;
            this.currentState = "up";
            this.addListener(flower.TouchEvent.TOUCH_BEGIN, this._onTouch, this);
            this.addListener(flower.TouchEvent.TOUCH_END, this._onTouch, this);
            this.addListener(flower.TouchEvent.TOUCH_RELEASE, this._onTouch, this);
        }

        public _getMouseTarget(matrix:flower.Matrix, mutiply:boolean):flower.DisplayObject {
            var target:flower.DisplayObject = super._getMouseTarget(matrix, mutiply);
            if (target) {
                target = this;
            }
            return target;
        }

        protected _onTouch(e:flower.TouchEvent) {
            if (!this.enabled) {
                e.stopPropagation();
                return;
            }
            switch (e.type) {
                case flower.TouchEvent.TOUCH_BEGIN :
                    this.currentState = "down";
                    break;
                case flower.TouchEvent.TOUCH_END :
                case flower.TouchEvent.TOUCH_RELEASE :
                    this.currentState = "up";
                    break;
            }
        }

        protected _setEnabled(val:boolean) {
            this._enabled = val;
            if (this._enabled) {
                this.currentState = "up";
            }
            else {
                this.currentState = "disabled";
            }
        }

        public set enabled(val:boolean) {
            val = !!val;
            if (this._enabled == val) {
                return;
            }
            this._setEnabled(val);
        }

        public get enabled():boolean {
            return this._enabled;
        }

        protected addUIEvents() {
            super.addUIEvents();
            this.addListener(flower.TouchEvent.TOUCH_END, this.onEXEClick, this);
        }

        private onClickEXE:Function;

        public set onClick(val:any) {
            if (typeof val == "string") {
                var content:string = <any>val;
                val = function () {
                    eval(content);
                }.bind(this.eventThis);
            }
            this.onClickEXE = val;
        }

        public get onClick():any {
            return this.onClickEXE;
        }

        private onEXEClick(e:flower.TouchEvent) {
            if (this.onClickEXE && e.target == this) {
                this.onClickEXE.call(this);
            }
        }
    }
}

