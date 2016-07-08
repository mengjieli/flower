function initPanel() {
    this.addListener(flower.Event.ADDED, this.$onPanelAdded, this);
}

function $onPanelAdded() {
    this.getAddedTween();
}

function getAddedTween() {
    return flower.Tween.to(this, 0.3, {
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

function getCloseTween() {
    return flower.Tween.to(this, 0.25, {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        scaleX: 0,
        scaleY: 0
    }, flower.Ease.QUINT_EASE_OUT, {
        x: this.x,
        y: this.y,
        scaleX: 1,
        scaleY: 1
    });
}


function closePanel() {
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

static function show(content) {
    var alert = new Alert();
    alert.content = content;
    flower.PopManager.pop(alert,true);
}