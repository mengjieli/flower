class MenuManager extends Sprite {

    __addFrame = 0;
    $autoRemove;

    constructor() {
        super();
    }

    $onTouch() {
        if (this.$autoRemove && flower.EnterFrame.frame > this.__addFrame && this.numChildren) {
            this.removeAll();
            return true;
        }
        return false;
    }

    $hasMenu() {
        return (flower.EnterFrame.frame > this.__addFrame && this.numChildren) ? true : false;
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

    static showMenu(display, x = -1, y = -1, autoRemove = true) {
        if (x == -1) {
            x = Stage.getInstance().mouseX + 1;
        }
        if (y == -1) {
            y = Stage.getInstance().mouseY;
        }
        display.x = x;
        display.y = y;
        MenuManager.getInstance().removeAll();
        MenuManager.getInstance().$autoRemove = autoRemove;
        MenuManager.getInstance().addChild(display);
    }

    static hideMenu() {
        MenuManager.getInstance().removeAll();
    }
}

exports.MenuManager = MenuManager;