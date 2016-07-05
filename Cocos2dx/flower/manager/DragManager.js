class DragManager extends Sprite {

    dragSource;
    dragSprite;
    dragType;
    dragData;
    __isDragging = false;
    __dragStartX;
    __dragStartY;
    __dragSourceX;
    __dragSourceY;
    __mouseX;
    __mouseY;

    constructor() {
        super();
        this.touchEnabled = false;
    }

    startDrag(startX, startY, dragSource, dragSprite, dragType = "", dragData = null) {
        this.__dragStartX = startX;
        this.__dragStartY = startY;
        this.dragSource = dragSource;
        this.dragSprite = dragSprite;
        this.dragType = dragType;
        this.dragData = dragData;
        this.__isDragging = true;
        if (dragSprite) {
            this.addChild(dragSprite);
        } else {
            this.__dragSourceX = dragSource.x;
            this.__dragSourceY = dragSource.y;
            this.__mouseX = this.x;
            this.__mouseY = this.y;
        }
    }

    $updatePosition(x, y) {
        this.x = x;
        this.y = y;
        if (this.isDragging && !this.dragSprite) {
            this.dragSource.x = this.x - this.__mouseX + this.__dragSourceX;
            this.dragSource.y = this.y - this.__mouseY + this.__dragSourceY;
        }
    }

    __stopDrag() {
        if (this.dragSprite && this.dragSprite.parent == this) {
            this.removeChild(this.dragSprite);
        }
        this.dragSource = null;
        this.dragSprite = null;
        this.dragType = "";
        this.dragData = null;
        this.__isDragging = false;
    }

    $dragEnd(display) {
        var event = flower.DragEvent.create(flower.DragEvent.DRAG_END, true, this.dragSource, this.dragType, this.dragData);
        display.dispatch(event);
        if (event.hasAccept) {

        } else {
            if (this.dragSprite) {
                this.parent.addChild(this.dragSprite);
                this.dragSprite.x = this.x;
                this.dragSprite.y = this.y;
                flower.Tween.to(this.dragSprite, 1, {
                    x: this.__dragStartX,
                    y: this.__dragStartY,
                    alpha: 0.1,
                }, flower.Ease.QUAD_EASE_IN_OUT).call(function (sprite) {
                    if (sprite.parent) {
                        sprite.dispose();
                    }
                }, null, this.dragSprite);
            }
        }
        this.__stopDrag();
    }

    get isDragging() {
        return this.__isDragging;
    }

    static instance;

    static getInstance() {
        if (!DragManager.instance) {
            DragManager.instance = new DragManager();
        }
        return DragManager.instance;
    }

    static startDrag(startX, startY, dragSource, dragSprite, dragType, dragData) {
        DragManager.instance.startDrag(startX, startY, dragSource, dragSprite, dragType, dragData);
    }
}
