function initPanel() {
    this.addListener(flower.Event.ADDED, this.$onPanelAdded, this);
}

function $onPanelAdded() {
    //this.getAddedTween();
}

function getAddedTween() {
    return flower.Tween.to(this, 0.3, {
        alpha: 1,
        //x:0,
        //y:100
        //x: (this.parent.width - this.width) / 2,
        //y: (this.parent.height - this.height) / 2,
        //scaleX: 1,
        //scaleY: 1
    }, flower.Ease.BACK_EASE_OUT, {
        alpha: 0,
        //y:0
        //x: this.parent.width / 2,
        //y: this.parent.height / 2,
        //scaleX: 0,
        //scaleY: 0
    });
}

function getCloseTween() {
    return null;
    return flower.Tween.to(this, 0.3, {
        fillAlpha: 0,
        //x: this.x + this.width / 2,
        //y: this.y + this.height / 2,
        //scaleX: 0,
        //scaleY: 0
    }, flower.Ease.SINE_EASE_IN_OUT, {
        fillAlpha: 1,
        //x: this.x,
        //y: this.y,
        //scaleX: 1,
        //scaleY: 1
    });
}


function close() {
    var tween = this.getCloseTween();
    if (tween) {
        tween.call(this.__closeComplete, this)
    } else {
        this.__closeComplete();
    }
}

function __closeComplete() {
    this.parent.dispose();
}