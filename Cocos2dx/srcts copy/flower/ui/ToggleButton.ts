module flower {
    export class ToggleButton extends Button {

        public constructor() {
            super();
        }

        protected _onTouch(e:flower.TouchEvent) {
            if (!this.enabled) {
                e.stopPropagation();
                return;
            }
            switch (e.type) {
                case flower.TouchEvent.TOUCH_BEGIN :
                    if (this._selected) {
                        this.currentState = "selectedDown";
                    } else {
                        this.currentState = "down";
                    }
                    break;
                case flower.TouchEvent.TOUCH_END :
                case flower.TouchEvent.TOUCH_RELEASE :
                    if(e.type == flower.TouchEvent.TOUCH_END) {
                        this.selected = !this.selected;
                    }
                    if (this._selected) {
                        this.currentState = "selectedUp";
                    } else {
                        this.currentState = "up";
                    }
                    break;
            }
        }

        protected _setEnabled(val:boolean) {
            super._setEnabled(val);
            if(val == false && this._selected) {
                this.selected = false;
            }
        }

        protected _setSelected(val:boolean) {
            this._selected = val;
            if (val) {
                this.currentState = "selectedUp";
            } else {
                this.currentState = "up";
            }
            if(this.onChangeEXE) {
                this.onChangeEXE.call(this);
            }
        }

        protected _selected:boolean = false;

        public get selected():boolean {
            return this._selected;
        }

        public set selected(val:boolean) {
            val = !!val;
            if (!this.enabled || val == this._selected) {
                return;
            }
            this._setSelected(val);
        }

        private onChangeEXE:Function;

        public set onChange(val:any) {
            if (typeof val == "string") {
                var content:string = <any>val;
                val = function () {
                    eval(content);
                }.bind(this.eventThis);
            }
            this.onChangeEXE = val;
        }

        public get onChange():any {
            return this.onChangeEXE;
        }
    }
}