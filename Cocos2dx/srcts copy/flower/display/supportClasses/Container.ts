module flower {
    export class Container {

        public static displayObjectContainerProperty:any = System.DisplayObjectContainer;

        public static init(container:any):void {
            container._childs = new Array<flower.DisplayObject>();
        }

        public static register(clazz:any, isMask:boolean = false):void {
            clazz.prototype._getMouseTarget = function (matrix:flower.Matrix, mutiply:boolean):flower.DisplayObject {
                if (this._touchEnabled == false || this._visible == false)
                    return null;
                if (mutiply == true && this._mutiplyTouchEnabled == false)
                    return null;
                matrix.save();
                matrix.translate(-this.x, -this.y);
                if (this.rotation)
                    matrix.rotate(-this.radian);
                if (this.scaleX != 1 || this.scaleY != 1) {
                    matrix.scale(1 / this.scaleX, 1 / this.scaleY);
                }
                this._touchX = matrix.tx;
                this._touchY = matrix.ty;
                var target:flower.DisplayObject;
                var childs = this._childs;
                var len:number = childs.length;
                for (var i:number = len - 1; i >= 0; i--) {
                    if (childs[i].touchEnabled && (mutiply == false || (mutiply == true && childs[i].mutiplyTouchEnabled == true))) {
                        target = childs[i]._getMouseTarget(matrix, mutiply);
                        if (target) {
                            break;
                        }
                    }
                }
                matrix.restore();
                return target;
            }
            clazz.prototype.addChild = function (child:flower.DisplayObject) {
                if (child.parent) {
                    if (child.parent != this) {
                        if (this.stage && child.stage) {
                            child.$stageFlag = true;
                            child.parent.removeChild(child);
                        } else {
                            child.parent.removeChild(child);
                        }
                    } else {
                        this.setChildIndex(child, this._childs.length - 1);
                        return;
                    }
                }
                this._childs.push(child);
                child.$parentAlpha = this.$parentAlpha * this.alpha;
                child.$setParent(this);
                if (child.$stageFlag) {
                    this.$stageFlag = false;
                } else if (this.stage) {
                    child.$onAddToStage(this.stage, this._nestLevel + 1);
                }
                this.$addFlag(0x4);
                this.$propagateFlagsUp(4);
            }
            clazz.prototype.addChildAt = function (child:flower.DisplayObject, index:number = 0):void {
                if (child.parent == this) {
                    this.setChildIndex(child, index);
                }
                else {
                    if (child.parent) {
                        if (child.parent != this) {
                            if (this.stage && child.stage) {
                                child.$stageFlag = true;
                                child.parent.removeChild(child);
                            } else {
                                child.parent.removeChild(child);
                            }
                        } else {
                            this.setChildIndex(child, index);
                            return;
                        }
                    }
                    this._childs.splice(index, 0, child);
                    child.$parentAlpha = this.$parentAlpha * this.alpha;
                    child.$setParent(this);
                    if (child.$stageFlag) {
                        this.$stageFlag = false;
                    } else if (this.stage) {
                        child.$onAddToStage(this.stage, this._nestLevel + 1);
                    }
                    this.$addFlag(0x4);
                    this.$propagateFlagsUp(4);
                }
            }
            clazz.prototype.getChildAt = function (index:number):flower.DisplayObject {
                index = +index & ~0;
                return this._childs[index];
            }
            clazz.prototype.removeChild = function (child:flower.DisplayObject):flower.DisplayObject {
                for (var i:number = 0; i < this._childs.length; i++) {
                    if (this._childs[i] == child) {
                        this._childs.splice(i, 1);
                        child.$parentAlpha = 1;
                        child.$setParent(null);
                        child.$onRemoveFromStage();
                        this.$addFlag(0x4);
                        this.$propagateFlagsUp(4);
                        return child;
                    }
                }
                return null;
            }
            clazz.prototype.removeAll = function () {
                while (this._childs.length) {
                    var child = this._childs.pop();
                    child.$parentAlpha = 1;
                    child.$setParent(null);
                    child.$onRemoveFromStage();
                    this.$addFlag(0x4);
                    this.$propagateFlagsUp(4);
                }
                return null;
            }
            clazz.prototype.removeChildAt = function (index:number):flower.DisplayObject {
                var child:flower.DisplayObject = this._childs.splice(index, 1)[0];
                child.$parentAlpha = 1;
                child.$setParent(null);
                child.$onRemoveFromStage();
                this.$addFlag(0x4);
                this.$propagateFlagsUp(4);
                return child;
            }
            clazz.prototype.setChildIndex = function (child:flower.DisplayObject, index:number):DisplayObject {
                var childIndex:number = this.getChildIndex(child);
                if (childIndex == index) {
                    return;
                }
                this._childs.splice(childIndex, 1);
                this._childs.splice(index, 0, child);
                this.$addFlag(0x4);
                return child;
            }
            clazz.prototype.sortChild = function (key:string, opt:number = 0) {
                this._childs.sort(function (a:DisplayObject, b:DisplayObject):number {
                    if (opt & Sort.DESCENDING) {
                        return b[key] - a[key];
                    }
                    return a[key] - b[key];
                });
                this.$addFlag(0x4);
            }
            clazz.prototype._resetChildIndex = function ():void {
                var i:number;
                if (System.IDE == "cocos2dx") {
                    for (i = 0; i < this._childs.length; i++) {
                        this._childs[i].$nativeShow["setLocalZOrder"].apply(this._childs[i].$nativeShow, [i]);
                    }
                }
                else {
                    var p:any = flower.Container.displayObjectContainerProperty.setChildIndex;
                    for (i = 0; i < this._childs.length; i++) {
                        this._show[p.func].apply(this._show, [this._childs[i].$nativeShow, i]);
                    }
                }
            }
            clazz.prototype.getChildIndex = function (child:flower.DisplayObject):number {
                for (var i:number = 0; i < this._childs.length; i++) {
                    if (this._childs[i] == child) {
                        return i;
                    }
                }
                return null;
            }
            clazz.prototype.contains = function (child:flower.DisplayObject):boolean {
                if (child.parent == this)
                    return true;
                return false;
            }
            clazz.prototype._alphaChange = function ():void {
                for (var i:number = 0; i < this._childs.length; i++) {
                    this._childs[i].$parentAlpha = this.$parentAlpha * this.alpha;
                }
            }
            clazz.prototype.$getSize = function () {
                this.$removeFlag(1);
            }
            Object.defineProperty(clazz.prototype, "numChildren", {
                get: function () {
                    return this._childs.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(clazz.prototype, "mesureWidth", {
                get: function () {
                    var sx = 0;
                    var ex = 0;
                    for (var child_key_a in this._childs) {
                        var child = this._childs[child_key_a];
                        if (child.x < sx) {
                            sx = child.x;
                        }
                        if (child.x + child.width > ex) {
                            ex = child.x + child.width;
                        }
                    }
                    return Math.floor(ex - sx);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(clazz.prototype, "mesureHeight", {
                get: function () {
                    var sy = 0;
                    var ey = 0;
                    for (var child_key_a in this._childs) {
                        var child = this._childs[child_key_a];
                        if (child.y < sy) {
                            sy = child.y;
                        }
                        if (child.y + child.width > ey) {
                            ey = child.y + child.height;
                        }
                    }
                    return Math.floor(ey - sy);
                },
                enumerable: true,
                configurable: true
            });
        }
    }
}