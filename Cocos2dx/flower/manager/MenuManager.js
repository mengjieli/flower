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