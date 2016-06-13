module flower {
    export class RadioButtonGroup extends Group {

        private _buttons:Array<RadioButton> = [];
        private _groupName:string;
        private _enabled:boolean = true;
        private _selection:RadioButton;

        public constructor(groupName:string) {
            super();
            if (groupName == null || groupName == "") {
                groupName = "group" + this.id;
            }
            this._groupName = groupName;
            RadioButtonGroup.groups.push(this);
        }

        public addChild(child:flower.DisplayObject) {
            super.addChild(child);
            if (child instanceof RadioButton && child.group != this) {
                child.groupName = this._groupName;
            }
        }

        public addChildAt(child:flower.DisplayObject, index:number = 0) {
            super.addChildAt(child);
            if (child instanceof RadioButton && child.group != this) {
                child.groupName = this._groupName;
            }
        }

        $itemSelectedChange(button:RadioButton):void {
            if (button.selected) {
                this.selection = button;
            }
        }

        $addButton(button:RadioButton):void {
            for (var i = 0; i < this._buttons.length; i++) {
                if (this._buttons[i] == button) {
                    return;
                }
            }
            this._buttons.push(button);
            if (this.enabled == false) {
                button.enabled = this.enabled;
            }
            if (button.selected) {
                if (!this._selection) {
                    this.selection = button;
                } else {
                    button.selected = false;
                }
            }
        }

        $removeButton(button:RadioButton):RadioButton {
            for (var i = 0; i < this._buttons.length; i++) {
                if (this._buttons[i] == button) {
                    this._buttons.splice(i, 1);
                    if (button == this._selection) {
                        this.selection = null;
                    }
                    return button;
                }
            }
            return null;
        }

        protected _setSelection(val:RadioButton) {
            this._selection = val;
            if (this._selection) {
                this._selection.selected = true;
            }
            for (var i = 0; i < this._buttons.length; i++) {
                if (this._buttons[i] != this._selection) {
                    this._buttons[i].selected = false;
                }
            }
            if (this.onChangeEXE) {
                this.onChangeEXE.call(this);
            }
        }

        public get selection():RadioButton {
            return this._selection;
        }

        public set selection(val:RadioButton) {
            if (!this._enabled || this._selection == val) {
                return;
            }
            this._setSelection(val);
        }

        public get groupName():string {
            return this._groupName;
        }

        public get enabled():boolean {
            return this._enabled;
        }

        public set enabled(val:boolean) {
            val = !!val;
            if (this._enabled == val) {
                return;
            }
            this._enabled = val;
            for (var i = 0; i < this._buttons.length; i++) {
                this._buttons[i].enabled = this._enabled;
            }
        }

        /////////////////////////////////////Event///////////////////////////////////
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

        private static groups:Array<RadioButtonGroup> = [];

        static $addButton(button:RadioButton):RadioButtonGroup {
            if (button.groupName && button.groupName != "") {
                var group:RadioButtonGroup;
                var list = RadioButtonGroup.groups;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].groupName == button.groupName) {
                        group = list[i];
                        break;
                    }
                }
                if (!group) {
                    group = new RadioButtonGroup(button.groupName);
                }
                group.$addButton(button);
                return group;
            }
            return null;
        }
    }
}