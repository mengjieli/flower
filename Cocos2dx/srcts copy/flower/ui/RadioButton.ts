module flower {
    export class RadioButton extends ToggleButton {

        private _groupName:string;
        private _group:RadioButtonGroup;

        public constructor() {
            super();
        }

        protected _setSelected(val:boolean) {
            if (val == false && this._group && this._group.selection == this) {
                return;
            }
            super._setSelected(val);
            if (this._group) {
                this._group.$itemSelectedChange(this);
            }
        }

        protected _setGroupName(val:string) {
            if (this._group) {
                this._group.$removeButton(this);
                this._group = null;
            }
            this._groupName = val;
            this._group = RadioButtonGroup.$addButton(this);
        }

        public get groupName():string {
            return this._groupName;
        }

        public set groupName(val:string) {
            if (val == this._groupName) {
                return;
            }
            this._setGroupName(val);
        }

        public get group():RadioButtonGroup {
            return this._group;
        }
    }
}