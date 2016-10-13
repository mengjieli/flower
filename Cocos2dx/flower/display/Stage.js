class Stage extends Sprite {

    __mouseX = 0;
    __mouseY = 0;
    __forntLayer;
    $background;
    $debugSprite
    $pop;
    $menu;
    $drag;

    constructor() {
        super();
        this.__stage = this;
        Stage.stages.push(this);
        this.$background = new Shape();
        this.__forntLayer = new Sprite();
        this.addChild(this.__forntLayer);
        this.$debugSprite = new Sprite();
        this.__forntLayer.addChild(this.$debugSprite);
        this.$pop = PopManager.getInstance();
        this.__forntLayer.addChild(this.$pop);
        this.$menu = MenuManager.getInstance();
        this.__forntLayer.addChild(this.$menu);
        this.$drag = DragManager.getInstance();
        this.__forntLayer.addChild(this.$drag);
        this.backgroundColor = 0;
    }

    get stageWidth() {
        return Platform.width;
    }

    get stageHeight() {
        return Platform.height;
    }

    addChildAt(child, index) {
        super.addChildAt(child, index);
        if (child != this.__forntLayer) {
            this.addChild(this.__forntLayer);
        }
    }

    ///////////////////////////////////////触摸事件处理///////////////////////////////////////
    __nativeMouseMoveEvent = [];
    __nativeRightClickEvent = [];
    __nativeTouchEvent = [];
    __mouseOverList = [this];
    __dragOverList = [this];
    __touchList = [];
    __lastMouseX = -1;
    __lastMouseY = -1;
    __lastRightX = -1;
    __lastRightY = -1;
    __focus = null;
    __touchTarget = null;

    $setFocus(val) {
        if (val && !val.focusEnabled) {
            val = null;
        }
        //if (this.__focus == val) {
        //    return;
        //}
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

    $addRightClickEvent(x, y) {
        this.__lastRightX = x;
        this.__lastRightY = y;
        this.__nativeRightClickEvent.push({x: x, y: y});
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
        this.__touchTarget = target;
        mouse.target = target;
        var parent = target.parent;
        var isMenu = false;
        while (parent && parent != this) {
            if (parent == this.$menu) {
                isMenu = true;
            }
            mouse.parents.push(parent);
            parent = parent.parent;
        }
        if (this.$menu.$hasMenu() && !isMenu) {
            this.__touchList.length = 0;
            return;
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

    $onRightClick(x, y) {
        if (this.$menu.$hasMenu()) {
            return;
        }
        var target = this.$getMouseTarget(x, y, false);
        this.__touchTarget = target;
        var event;
        event = new flower.MouseEvent(flower.MouseEvent.RIGHT_CLICK);
        event.$stageX = x;
        event.$stageY = y;
        event.$target = target;
        event.$touchX = target.lastTouchX;
        event.$touchY = target.lastTouchY;
        target.dispatch(event);
    }

    $onMouseMove(x, y) {
        this.__mouseX = x;
        this.__mouseY = y;
        var target = this.$getMouseTarget(x, y, false);
        var parent = target.parent;
        var event;
        var list = [];
        this.$drag.$updatePosition(x, y);
        if (this.$drag.isDragging) {
            if (target) {
                list.push(target);
            }
            while (parent && parent != this) {
                list.push(parent);
                parent = parent.parent;
            }
            for (var i = 0; i < list.length; i++) {
                var find = false;
                for (var j = 0; j < this.__dragOverList.length; j++) {
                    if (list[i] == this.__dragOverList[j]) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    event = new flower.DragEvent(flower.DragEvent.DRAG_OVER, false);
                    event.$stageX = x;
                    event.$stageY = y;
                    event.$target = target;
                    event.$touchX = list[i].lastTouchX;
                    event.$touchY = list[i].lastTouchY;
                    list[i].dispatch(event);
                }
            }
            for (var j = 0; j < this.__dragOverList.length; j++) {
                var find = false;
                for (var i = 0; i < list.length; i++) {
                    if (list[i] == this.__dragOverList[j]) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    event = new flower.DragEvent(flower.DragEvent.DRAG_OUT, false);
                    event.$stageX = x;
                    event.$stageY = y;
                    event.$target = target;
                    event.$touchX = this.__dragOverList[j].lastTouchX;
                    event.$touchY = this.__dragOverList[j].lastTouchY;
                    this.__dragOverList[j].dispatch(event);
                }
            }
            this.__dragOverList = list;
        } else {
            if (target) {
                list.push(target);
            }
            while (parent && parent != this) {
                list.push(parent);
                parent = parent.parent;
            }
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
        if (this.$drag.isDragging) {
            this.$drag.$dragEnd(target);
        }
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
        } else {
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

    ///////////////////////////////////////键盘事件处理///////////////////////////////////////
    $keyEvents = [];

    $onKeyDown(key) {
        if (key == 16) {
            KeyboardEvent.$shift = true;
        }
        if (key == 17) {
            KeyboardEvent.$control = true;
        }
        if (key == 18) {
            KeyboardEvent.$alt = true;
        }
        this.$keyEvents.push({
            type: KeyboardEvent.KEY_DOWN,
            shift: KeyboardEvent.$shift,
            control: KeyboardEvent.$control,
            alt: KeyboardEvent.$alt,
            key: key
        });

    }

    $onKeyUp(key) {
        if (key == 16) {
            KeyboardEvent.$shift = false;
        }
        if (key == 17) {
            KeyboardEvent.$control = false;
        }
        if (key == 18) {
            KeyboardEvent.$alt = false;
        }
        this.$keyEvents.push({
            type: KeyboardEvent.KEY_UP,
            shift: KeyboardEvent.$shift,
            control: KeyboardEvent.$control,
            alt: KeyboardEvent.$alt,
            key: key
        });
    }

    $dispatchKeyEvent(info) {
        var shift = KeyboardEvent.$shift;
        var control = KeyboardEvent.$control;
        var alt = KeyboardEvent.$alt;
        KeyboardEvent.$shift = info.shift;
        KeyboardEvent.$control = info.control;
        KeyboardEvent.$alt = info.alt;
        if (info.type == KeyboardEvent.KEY_DOWN) {
            var event = new KeyboardEvent(KeyboardEvent.KEY_DOWN, info.key);
            if (this.__focus) {
                this.__focus.dispatch(event);
            } else {
                this.dispatch(event);
            }
        } else if (info.type == KeyboardEvent.KEY_UP) {
            var event = new KeyboardEvent(KeyboardEvent.KEY_UP, info.key);
            if (this.__focus) {
                this.__focus.dispatch(event);
            } else {
                this.dispatch(event);
            }
        }
        KeyboardEvent.$shift = shift;
        KeyboardEvent.$control = control;
        KeyboardEvent.$alt = alt;
    }

    ///////////////////////////////////////键盘事件处理///////////////////////////////////////

    $onFrameEnd() {
        var touchList = this.__nativeTouchEvent;
        var mouseMoveList = this.__nativeMouseMoveEvent;
        var rightClickList = this.__nativeRightClickEvent;
        var hasclick = false;
        while (touchList.length) {
            var touch = touchList.shift();
            if (touch.type == "begin") {
                this.$onTouchBegin(touch.id, touch.x, touch.y);
            } else if (touch.type == "move") {
                this.$onTouchMove(touch.id, touch.x, touch.y);
            } else if (touch.type == "end") {
                hasclick = true;
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
        if (rightClickList.length) {
            hasclick = true;
            var rightInfo = rightClickList[rightClickList.length - 1];
            this.$onRightClick(rightInfo.x, rightInfo.y);
        }
        rightClickList.length = 0;
        if (hasclick) {
            this.$menu.$onTouch(this.__touchTarget);
        }
        while (this.$keyEvents.length) {
            this.$dispatchKeyEvent(this.$keyEvents.shift());
        }
        super.$onFrameEnd();
        //this.$background.$onFrameEnd();
    }

    $setWidth(val) {
        return;
    }

    $setHeight(val) {
        return;
    }

    $resize(width, height) {
        super.$setWidth(width);
        super.$setHeight(height);
        this.$background.clear();
        this.$background.drawRect(0, 0, this.width, this.height);
        this.$pop.$resize(width, height);
        this.$menu.$resize(width, height);
    }

    set backgroundColor(val) {
        this.$background.clear();
        this.$background.fillColor = val;
        this.$background.drawRect(0, 0, this.width, this.height);
    }

    get backgroundColor() {
        return this.$background.fillColor;
    }

    get focus() {
        return this.__focus;
    }

    set focus(val) {
        this.$setFocus(val);
    }

    get debugContainer() {
        return this.$debugSprite;
    }

    get mouseX() {
        return this.__mouseX;
    }

    get mouseY() {
        return this.__mouseY;
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

    static getShortcut() {
        return Platform.getShortcut();
    }
}

exports.Stage = Stage;