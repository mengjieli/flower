class ObjectValue extends Value {

    constructor() {
        super();
        this.__old = this.__value = {};
    }

    update(...args) {
        var change = false;
        for (var i = 0; i < args.length;) {
            var name = args[i];
            if (i + 1 >= args.length) {
                break;
            }
            var value = args[i + 1];
            var obj = this[name];
            if (obj instanceof Value) {
                if (obj.value != value) {
                    obj.value = value;
                    change = true;
                }
            } else {
                if (obj != value) {
                    this[name] = value;
                    change = true;
                }
            }
            this[name] = value;
            i += 2;
        }
        if (change) {
            this.dispatchWidth(flower.Event.UPDATE, this);
        }
    }

    addMember(name, value) {
        this[name] = value;
    }

    deleteMember(name) {
        delete this[name];
    }
}

exports.ObjectValue = ObjectValue;