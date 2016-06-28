class Stage extends Sprite {
    constructor() {
        super();
        this.__stage = this;
        Stage.stages.push(this);
    }

    get stageWidth() {
        return Platform.width;
    }

    get stageHeight() {
        return Platform.height;
    }

    ///////////////////////////////////////触摸事件处理///////////////////////////////////////
    __nativeMouseMoveEvent = [];
    __nativeTouchEvent = [];
    __mouseOverList = [this];
    __touchList = [];
    __lastMouseX = -1;
    __lastMouseY = -1;
    __focus = null;

    $setFocus(val) {
        if (val && !val.$focusEnabled) {
            val = null;
        }
        if (this.__focus == val) {
            return;
        }
        var event;
        if (this.__focus) {
            event = new flower.Event(Event.FOCUS_OUT, true);
            this.__focus.dispatch(event);
        }
        this.__focus = val;
        if (this.__focus) {
            event = new flower.Event(Event.FOCUS_IN, true);
            this.__focus.dispatch(event);
        }
    }

    $addMouseMoveEvent(x, y) {
        this.__lastMouseX = x;
        this.__lastMouseY = y;
        this.__nativeMouseMoveEvent.push({x: x, y: y});
        //flower.trace("mouseEvent",x,y);
    }

    $addTouchEvent(type, id, x, y) {
        this.__nativeTouchEvent.push({
            type: type,
            id: id,
            x: x,
            y: y
        });
        //flower.trace("touchEvent",type,id,x,y);
    }

    $getMouseTarget(touchX, touchY, mutiply) {
        var target = super.$getMouseTarget(touchX, touchY, mutiply) || this;
        return target;
    }

    $onTouchBegin(id, x, y) {
        var mouse = {
            id: 0,
            mutiply: false,
            startX: 0,
            startY: 0,
            moveX: 0,
            moveY: 0,
            target: null,
            parents: []
        };
        mouse.id = id;
        mouse.startX = x;
        mouse.startY = y;
        mouse.mutiply = this.__touchList.length == 0 ? false : true;
        this.__touchList.push(mouse);
        var target = this.$getMouseTarget(x, y, mouse.mutiply);
        mouse.target = target;
        var parent = target.parent;
        while (parent && parent != this) {
            mouse.parents.push(parent);
            parent = parent.parent;
        }
        if (target) {
            this.$setFocus(target);
        }
        //target.addListener(flower.Event.REMOVED, this.onMouseTargetRemove, this);
        if (target) {
            var event;
            event = new flower.TouchEvent(flower.TouchEvent.TOUCH_BEGIN);
            event.$touchId = id;
            event.$stageX = x;
            event.$stageY = y;
            event.$target = target;
            event.$touchX = target.lastTouchX;
            event.$touchY = target.lastTouchY;
            target.dispatch(event);
        }
    }

    $onMouseMove(x, y) {
        var target = this.$getMouseTarget(x, y, false);
        var parent = target.parent;
        var list = [];
        if (target) {
            list.push(target);
        }
        while (parent && parent != this) {
            list.push(parent);
            parent = parent.parent;
        }
        var event;
        for (var i = 0; i < list.length; i++) {
            var find = false;
            for (var j = 0; j < this.__mouseOverList.length; j++) {
                if (list[i] == this.__mouseOverList[j]) {
                    find = true;
                    break;
                }
            }
            if (!find) {
                event = new flower.MouseEvent(flower.MouseEvent.MOUSE_OVER, false);
                event.$stageX = x;
                event.$stageY = y;
                event.$target = target;
                event.$touchX = list[i].lastTouchX;
                event.$touchY = list[i].lastTouchY;
                list[i].dispatch(event);
            }
        }
        for (var j = 0; j < this.__mouseOverList.length; j++) {
            var find = false;
            for (var i = 0; i < list.length; i++) {
                if (list[i] == this.__mouseOverList[j]) {
                    find = true;
                    break;
                }
            }
            if (!find) {
                event = new flower.MouseEvent(flower.MouseEvent.MOUSE_OUT, false);
                event.$stageX = x;
                event.$stageY = y;
                event.$target = target;
                event.$touchX = this.__mouseOverList[j].lastTouchX;
                event.$touchY = this.__mouseOverList[j].lastTouchY;
                this.__mouseOverList[j].dispatch(event);
            }
        }
        this.__mouseOverList = list;
        if (target) {
            event = new flower.MouseEvent(flower.MouseEvent.MOUSE_MOVE);
            event.$stageX = x;
            event.$stageY = y;
            event.$target = target;
            event.$touchX = target.lastTouchX;
            event.$touchY = target.lastTouchY;
            target.dispatch(event);
        }
    }

    $onTouchMove(id, x, y) {
        var mouse;
        for (var i = 0; i < this.__touchList.length; i++) {
            if (this.__touchList[i].id == id) {
                mouse = this.__touchList[i];
                break;
            }
        }
        if (mouse == null) {
            return;
        }
        if (mouse.moveX == x && mouse.moveY == y) {
            return;
        }
        while (mouse.target.stage == null && mouse.parents.length) {
            mouse.target = mouse.parents.shift();
        }
        if (!mouse.target) {
            mouse.target = this;
        }
        this.$getMouseTarget(x, y, mouse.mutiply);
        var target = mouse.target;//this.$getMouseTarget(x, y, mouse.mutiply);
        mouse.moveX = x;
        mouse.moveY = y;
        var event;
        if (target) {
            event = new flower.TouchEvent(flower.TouchEvent.TOUCH_MOVE);
            event.$touchId = id;
            event.$stageX = x;
            event.$stageY = y;
            event.$target = target;
            event.$touchX = target.lastTouchX;
            event.$touchY = target.lastTouchY;
            target.dispatch(event);
        }
    }

    $onTouchEnd(id, x, y) {
        var mouse;
        for (var i = 0; i < this.__touchList.length; i++) {
            if (this.__touchList[i].id == id) {
                mouse = this.__touchList.splice(i, 1)[0];
                break;
            }
        }
        if (mouse == null) {
            return;
        }
        while (mouse.target.stage == null && mouse.parents.length) {
            mouse.target = mouse.parents.shift();
        }
        if (!mouse.target) {
            mouse.target = this;
        }
        var target = this.$getMouseTarget(x, y, mouse.mutiply);
        var event;
        if (target == mouse.target) {
            event = new flower.TouchEvent(flower.TouchEvent.TOUCH_END);
            event.$touchId = id;
            event.$stageX = x;
            event.$stageY = y;
            event.$target = target;
            event.$touchX = target.lastTouchX;
            event.$touchY = target.lastTouchY;
            target.dispatch(event);
        }
        else {
            target = mouse.target;
            event = new flower.TouchEvent(flower.TouchEvent.TOUCH_RELEASE);
            event.$touchId = id;
            event.$stageX = x;
            event.$stageY = y;
            event.$target = target;
            event.$touchX = target.lastTouchX;
            event.$touchY = target.lastTouchY;
            target.dispatch(event);
        }
    }

    ///////////////////////////////////////触摸事件处理///////////////////////////////////////
    $onFrameEnd() {
        var touchList = this.__nativeTouchEvent;
        var mouseMoveList = this.__nativeMouseMoveEvent;
        while (touchList.length) {
            var touch = touchList.shift();
            if (touch.type == "begin") {
                this.$onTouchBegin(touch.id, touch.x, touch.y);
            } else if (touch.type == "move") {
                this.$onTouchMove(touch.id, touch.x, touch.y);
            } else if (touch.type == "end") {
                this.$onTouchEnd(touch.id, touch.x, touch.y);
            }
        }
        if (mouseMoveList.length == 0) {
            mouseMoveList.push({x: this.__lastMouseX, y: this.__lastMouseY});
        }
        if (mouseMoveList.length) {
            var moveInfo = mouseMoveList[mouseMoveList.length - 1];
            this.$onMouseMove(moveInfo.x, moveInfo.y);
        }
        mouseMoveList.length = 0;
        super.$onFrameEnd();
    }

    get focus() {
        return this.__focus;
    }

    set focus(val) {
        this.$setFocus(val);
    }

    static stages = [];

    static getInstance() {
        return Stage.stages[0];
    }

    static $onFrameEnd() {
        for (var i = 0; i < Stage.stages.length; i++) {
            Stage.stages[i].$onFrameEnd();
        }
    }
}

exports.Stage = Stage;