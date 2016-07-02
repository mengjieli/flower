class RadioButtonGroup extends Group {

    _buttons = [];
    _groupName;
    _enabled = true;
    _selection;

    constructor(groupName) {
        super();
        if (groupName == null || groupName == "") {
            groupName = "group" + this.id;
        }
        this._groupName = groupName;
        RadioButtonGroup.groups.push(this);
    }

    addChildAt(child, index = 0) {
        super.addChildAt(child);
        if (child instanceof RadioButton && child.group != this) {
            child.groupName = this._groupName;
        }
    }

    $itemSelectedChange(button) {
        if (button.selected) {
            this.selection = button;
        }
    }

    $addButton(button) {
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

    $removeButton(button) {
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

    __setSelection(val) {
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

    get selection() {
        return this._selection;
    }

    set selection(val) {
        if (!this._enabled || this._selection == val) {
            return;
        }
        this.__setSelection(val);
    }

    get groupName() {
        return this._groupName;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(val) {
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
    onChangeEXE;

    set onChange(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onChangeEXE = val;
    }

    get onChange() {
        return this.onChangeEXE;
    }

    /////////////////////////////////////static///////////////////////////////////
    static groups = [];

    static $addButton(button) {
        if (button.groupName && button.groupName != "") {
            var group;
            var groupGroup;
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

exports.RadioButtonGroup = RadioButtonGroup;