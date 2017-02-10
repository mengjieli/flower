class Particle extends flower.Sprite {

    __config;
    __particles;
    __cycles;
    __texture;

    constructor(config) {
        super();
        this.__particles = [];
        this.__cycles = [];
        if (typeof config == "string") {
            var loader = new flower.URLLoader(config);
            loader.load();
            loader.addListener(flower.Event.COMPLETE, this.__loadConfigComplete, this);
        } else {
            this.setConfig(config);
        }
        flower.EnterFrame.add(this.__update, this);
    }

    __loadConfigComplete(e) {
        this.setConfig(e.data);
    }

    setConfig(config) {
        this.__config = config;
        //{
        //    "name": "粒子特效",
        //    "image": "",
        //    "mode": 0,
        //    "life": 0,
        //    "lifev": 0,
        //    "max": 0,
        //    "gx": 0,
        //    "gy": 0
        //}
        this.__texture = null;
        if (this.loader) {
            this.loader.dispose();
            this.loader = null;
        }
        var loader = new flower.URLLoader(config.image);
        loader.load();
        loader.addListener(flower.Event.COMPLETE, this.__loadTextureComplete, this);
        this.loader = loader;
        while (this.__cycles.length) {
            this.__cycles.pop().image.dispose();
        }
        this.__lastCount = 0;
    }

    __loadTextureComplete(e) {
        this.loader = null;
        this.__texture = e.data;
    }

    __update(time, gap) {
        if (!this.__texture) {
            return;
        }
        gap = gap / 1000;
        var cfg = this.__config;
        var particles = this.__particles;
        var cycles = this.__cycles;

        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            if (particle.life <= 0) {
                particles.splice(i, 1);
                i--;
                cycles.push(particle);
                //particle.image.parent.removeChild(particle.image);
                particle.image.visible = false;
            }
        }

        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            particle.life -= gap;
            particle.vx += cfg.gx * gap;
            particle.vy += -cfg.gy * gap;
            particle.x += particle.vx * gap;
            particle.y += particle.vy * gap;
            particle.scale += particle.scaleV * gap;
            particle.rotation += particle.rotationV * gap;
            particle.alpha += particle.alphaV * gap;
            particle.red += particle.redV * gap;
            particle.green += particle.greenV * gap;
            particle.blue += particle.blueV * gap;
            if (particle.oldX != ~~particle.x) {
                particle.oldX = ~~particle.x;
                particle.image.$nativeShow.setX(particle.oldX);
            }
            if (particle.oldY != ~~particle.y) {
                particle.oldY = ~~particle.y;
                particle.image.$nativeShow.setY(particle.oldY);
            }
            if (particle.oldScale != ~~particle.scale) {
                particle.oldScale = ~~particle.scale;
                particle.image.$nativeShow.setScaleX((particle.oldScale < 0 ? 0 : particle.oldScale) / 100);
                particle.image.$nativeShow.setScaleY((particle.oldScale < 0 ? 0 : particle.oldScale) / 100);
            }
            if (particle.oldAlpha != ~~particle.alpha) {
                particle.oldAlpha = ~~particle.alpha;
                particle.image.alpha = particle.oldAlpha / 255;
            }
            if (particle.oldRed != ~~particle.red || particle.oldGreen != ~~particle.green || particle.oldBlue != ~~particle.blue) {
                particle.oldRed = ~~particle.red;
                particle.oldGreen = ~~particle.green;
                particle.oldBlue = ~~particle.blue;
                particle.filters[0].r = particle.oldRed;
                particle.filters[0].g = particle.oldGreen;
                particle.filters[0].b = particle.oldBlue;
                particle.image.filters = particle.filters;
            }
            if (particle.oldRotation != ~~particle.rotation) {
                particle.oldRotation = ~~particle.rotation;
                particle.image.rotation = particle.oldRotation;
            }
        }

        var count = cfg.max * gap / cfg.life + this.__lastCount;
        this.__lastCount = count - ~~count;
        count = ~~count;
        if (particles.length + count > cfg.max) {
            count = cfg.max - particles.length;
        }
        for (var i = 0; i < count; i++) {
            var item;
            var scale = cfg.initSize - cfg.initSizeV + 2 * cfg.initSizeV * math.random();
            var endScale = cfg.endSize - cfg.endSizeV + 2 * cfg.endSizeV * math.random();
            var alpha = cfg.initAlpha - cfg.initAlphaV + 2 * cfg.initAlphaV * math.random();
            var endAlpha = cfg.endAlpha - cfg.endAlphaV + 2 * cfg.endAlphaV * math.random();
            var red = cfg.initRed - cfg.initRedV + 2 * cfg.initRedV * math.random();
            var endRed = cfg.endRed - cfg.endRedV + 2 * cfg.endRedV * math.random();
            var green = cfg.initGreen - cfg.initGreenV + 2 * cfg.initGreenV * math.random();
            var endGreen = cfg.endGreen - cfg.endGreenV + 2 * cfg.endGreenV * math.random();
            var blue = cfg.initBlue - cfg.initBlueV + 2 * cfg.initBlueV * math.random();
            var endBlue = cfg.endBlue - cfg.endBlueV + 2 * cfg.endBlueV * math.random();
            var rotation = cfg.initRotation - cfg.initRotationV + 2 * cfg.initRotationV * math.random();
            var endRotation = cfg.endRotation - cfg.endRotationV + 2 * cfg.endRotationV * math.random();
            var shootSpeed = cfg.shootSpeed - cfg.shootSpeedV + 2 * math.random() * cfg.shootSpeedV;
            var shootRotation = cfg.shootRotation - cfg.shootRotationV + 2 * math.random() * cfg.shootRotationV;
            shootRotation = shootRotation * math.PI / 180;
            var vx = math.cos(shootRotation) * shootSpeed;
            var vy = -math.sin(shootRotation) * shootSpeed;
            var life = cfg.life - cfg.lifev + 2 * math.random() * cfg.lifev;
            if (cycles.length) {
                item = cycles.pop();
                item.life = life;
                item.vx = vx;
                item.vy = vy;
                item.scale = scale;
                item.scaleV = (endScale - scale) / life;
                item.alpha = alpha;
                item.alphaV = (endAlpha - alpha) / life;
                item.red = red;
                item.redV = (endRed - red) / life;
                item.green = green;
                item.greenV = (endGreen - green) / life;
                item.blue = blue;
                item.blueV = (endBlue - blue) / life;
                item.rotation = rotation;
                item.rotationV = (endRotation - rotation) / life;
                item.image.visible = true;
            } else {
                item = {
                    image: new flower.Bitmap(this.__texture),
                    mode: cfg.mode,
                    life: life,
                    x: 0,
                    y: 0,
                    vx: vx,
                    vy: vy,
                    scale: scale,
                    scaleV: (endScale - scale) / life,
                    alpha: alpha,
                    alphaV: (endAlpha - alpha) / life,
                    red: red,
                    redV: (endRed - red) / life,
                    green: green,
                    greenV: (endGreen - green) / life,
                    blue: blue,
                    blueV: (endBlue - blue) / life,
                    rotation: rotation,
                    rotationV: (endRotation - rotation) / life,
                    oldX: 0,
                    oldY: 0,
                    oldScale: 1,
                    oldAlpha: 1,
                    oldRotation: 0,
                    oldRed: 0,
                    oldGreen: 0,
                    oldBlue: 0,
                    filters: [new flower.DyeingFilter()]
                }
                item.image.$setSimpleMode();
                this.addChild(item.image);
            }
            item.x = -cfg.xv + cfg.xv * 2 * math.random();
            item.y = -cfg.yv + cfg.yv * 2 * math.random();
            if (item.oldX != ~~item.x) {
                item.oldX = ~~item.x;
                item.image.$nativeShow.setX(item.oldX);
            }
            if (item.oldY != ~~item.y) {
                item.oldY = ~~item.y;
                item.image.$nativeShow.setY(item.oldY);
            }
            if (item.oldScale != ~~item.scale) {
                item.oldScale = ~~item.scale;
                item.image.$nativeShow.setScaleX(item.oldScale / 100);
                item.image.$nativeShow.setScaleY(item.oldScale / 100);
            }
            if (item.oldAlpha != ~~item.alpha) {
                item.oldAlpha = ~~item.alpha;
                item.image.alpha = item.oldAlpha / 255;
            }
            if (item.oldRed != ~~item.red || item.oldGreen != ~~item.green || item.oldBlue != ~~item.blue) {
                item.oldRed = ~~item.red;
                item.oldGreen = ~~item.green;
                item.oldBlue = ~~item.blue;
                item.filters[0].r = item.oldRed;
                item.filters[0].g = item.oldGreen;
                item.filters[0].b = item.oldBlue;
                item.image.filters = item.filters;
            }
            if (item.oldRotation != ~~item.rotation) {
                item.oldRotation = ~~item.rotation;
                item.image.rotation = item.oldRotation;
            }
            particles.push(item);
        }
    }

    $getMouseTarget(touchX, touchY, multiply) {
        var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
        touchX = math.floor(point.x);
        touchY = math.floor(point.y);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
        p[22] = flower.EnterFrame.frame;
        var bounds = this.$getContentBounds();
        if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.x + this.width && touchY < bounds.y + this.height) {
            return this;
        }
        return null;
    }

    $onFrameEnd() {
        this.$removeFlags(0x0100);
        super.$onFrameEnd();
    }

    dispose() {
        flower.EnterFrame.remove(this.__update, this);
        while (this.__cycles.length) {
            this.__cycles.pop().image.dispose();
        }
        super.dispose();
    }
}

exports.Particle = Particle;