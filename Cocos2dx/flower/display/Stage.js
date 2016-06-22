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
    __touchList = [];

    getMouseTarget(touchX, touchY, mutiply) {
        var matrix = Matrix.$matrix;
        matrix.identity();
        matrix.tx = touchX;
        matrix.ty = touchY;
        var target = this.$getMouseTarget(matrix, mutiply) || this;
        return target;
    }

    onMouseDown(id, x, y) {
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
        var target = this.getMouseTarget(x, y, mouse.mutiply);
        mouse.target = target;
        var parent = target.parent;
        while (parent && parent != this) {
            mouse.parents.push(parent);
            parent = parent.parent;
        }
        //target.addListener(flower.Event.REMOVED, this.onMouseTargetRemove, this);
        if (target) {
            var event = new flower.TouchEvent(flower.TouchEvent.TOUCH_BEGIN);
            event.stageX = x;
            event.stageY = y;
            event.$target = target;
            event.touchX = target.lastTouchX;
            event.touchY = target.lastTouchY;
            target.dispatch(event);
        }
    }

    onMouseMove(id, x, y) {
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
        this.getMouseTarget(x, y, mouse.mutiply);
        var target = mouse.target;//this.getMouseTarget(x, y, mouse.mutiply);
        mouse.moveX = x;
        mouse.moveY = y;
        var event;
        if (target) {
            event = new flower.TouchEvent(flower.TouchEvent.TOUCH_MOVE);
            event.stageX = x;
            event.stageY = y;
            event.$target = target;
            event.touchX = target.lastTouchX;
            event.touchY = target.lastTouchY;
            target.dispatch(event);
        }
    }

    onMouseUp(id, x, y) {
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
        var target = this.getMouseTarget(x, y, mouse.mutiply);
        var event;
        if (target == mouse.target) {
            event = new flower.TouchEvent(flower.TouchEvent.TOUCH_END);
            event.stageX = x;
            event.stageY = y;
            event.$target = target;
            event.touchX = target.lastTouchX;
            event.touchY = target.lastTouchY;
            target.dispatch(event);
        }
        else {
            target = mouse.target;
            event = new flower.TouchEvent(flower.TouchEvent.TOUCH_RELEASE);
            event.stageX = x;
            event.stageY = y;
            event.$target = target;
            event.touchX = target.lastTouchX;
            event.touchY = target.lastTouchY;
            target.dispatch(event);
        }
    }

    ///////////////////////////////////////触摸事件处理///////////////////////////////////////

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