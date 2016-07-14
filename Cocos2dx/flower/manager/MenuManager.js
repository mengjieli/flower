class MenuManager extends Sprite {

    __addFrame = 0;

    constructor() {
        super();
        this.addListener(Event.ADDED_TO_STAGE, this.__addedToStage, this);
    }

    __addedToStage(e) {
        this.removeListener(Event.ADDED_TO_STAGE, this.addedToStage, this);
        this.stage.addListener(TouchEvent.TOUCH_BEGIN, this.__onTouch, this);
    }

    __onTouch(e) {
        var frame = flower.EnterFrame.frame;
        if (frame > this.__addFrame && this.numChildren) {
            this.removeAll();
        }
    }

    addChildAt(child, index) {
        this.__addFrame = flower.EnterFrame.frame;
        super.addChildAt(child, index);
    }

    $resize(width, height) {
        this.width = width;
        this.height = height;
    }

    $onFrameEnd() {
        for (var i = 0; i < this.numChildren; i++) {
            var child = this.getChildAt(i);
            if (child.x < 0) {
                child.x = 0;
            }
            if (child.y < 0) {
                child.y = 0;
            }
            if (child.x + child.width > this.width) {
                child.x = this.width - child.width;
            }
            if (child.y + child.height > this.height) {
                child.y = this.height - child.height;
            }
        }
        super.$onFrameEnd();
    }

    static instance;

    static getInstance() {
        if (!MenuManager.instance) {
            MenuManager.instance = new MenuManager();
        }
        return MenuManager.instance;
    }

    static showMenu(display) {
        MenuManager.getInstance().removeAll();
        MenuManager.getInstance().addChild(display);
    }
}

exports.MenuManager = MenuManager;