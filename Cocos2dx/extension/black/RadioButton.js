class RadioButton extends ToggleButton {

    _groupName;
    _group;

    constructor() {
        super();
    }

    __setSelected(val) {
        if (val == false && this._group && this._group.selection == this) {
            return;
        }
        super.__setSelected(val);
        if (this._group) {
            this._group.$itemSelectedChange(this);
        }
        this.dispatchWith(flower.Event.CHANGE);
    }

    __setGroupName(val) {
        if (val == this._groupName) {
            return;
        }
        if (this._group) {
            this._group.$removeButton(this);
            this._group = null;
        }
        this._groupName = val;
        this._group = RadioButtonGroup.$addButton(this);
    }

    get groupName() {
        return this._groupName;
    }

    set groupName(val) {
        this.__setGroupName(val);
    }

    get group() {
        return this._group;
    }
}

exports.RadioButton = RadioButton;

UIComponent.registerEvent(RadioButton, 1401, "change", flower.Event.CHANGE);