function initPanel() {
    this.addListener(flower.Event.ADDED, this.$onPanelAdded, this);
}

function $onPanelAdded() {
    flower.Tween.to(this, 0.3, {
        x: (this.parent.width - this.width) / 2,
        y: (this.parent.height - this.height) / 2,
        scaleX: 1,
        scaleY: 1
    }, flower.Ease.BACK_EASE_OUT, {
        x: this.parent.width / 2,
        y: this.parent.height / 2,
        scaleX: 0,
        scaleY: 0
    });
}

function close() {
    flower.Tween.to(this, 0.3, {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        scaleX: 0,
        scaleY: 0
    }, flower.Ease.SINE_EASE_IN_OUT, {
        x: this.x,
        y: this.y,
        scaleX: 1,
        scaleY: 1
    }).call(this.__closeComplete, this);
}

function __closeComplete() {
    this.parent.dispose();
}