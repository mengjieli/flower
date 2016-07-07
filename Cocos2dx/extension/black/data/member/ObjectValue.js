class ObjectValue extends Value {

    constructor() {
        super();
        this.__old = this.__value = {};
    }

    //update(...args) {
    //    var change = false;
    //    for (var i = 0; i < args.length;) {
    //        var name = args[i];
    //        if (i + 1 >= args.length) {
    //            break;
    //        }
    //        var value = args[i + 1];
    //        var obj = this[name];
    //        if (obj instanceof Value) {
    //            if (obj.value != value) {
    //                obj.value = value;
    //                change = true;
    //            }
    //        } else {
    //            if (obj != value) {
    //                this[name] = value;
    //                change = true;
    //            }
    //        }
    //        i += 2;
    //    }
    //    if (change) {
    //        this.dispatchWidth(flower.Event.UPDATE, this);
    //    }
    //}
    //
    //addMember(name, value) {
    //    this[name] = value;
    //    this.dispatchWidth(flower.Event.UPDATE, this);
    //}
    //
    //
    //deleteMember(name) {
    //    delete this[name];
    //}

    dispose() {
        for (var key in this) {
            if (this[key] instanceof Value) {
                this[key].dispose();
            }
        }
        super.dispose();
    }
}

exports.ObjectValue = ObjectValue;