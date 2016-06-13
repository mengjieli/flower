module flower {
    export class Stage extends flower.Sprite {
        public static stages:Array<any>;

        public constructor() {
            super();
            this._stage = this;
            flower.Stage.stages.push(this);
        }

        public getMouseTarget(touchX:number, touchY:number, mutiply:boolean):flower.DisplayObject {
            var matrix:flower.Matrix = flower.Matrix.$matrix;
            matrix.identity();
            matrix.tx = touchX;
            matrix.ty = touchY;
            var target:flower.DisplayObject = this._getMouseTarget(matrix, mutiply) || this;
            return target;
        }

        private touchList:Array<any> = [];

        public onMouseDown(id:number, x:number, y:number) {
            var mouse:any = {
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
            mouse.mutiply = this.touchList.length == 0 ? false : true;
            this.touchList.push(mouse);
            var target:flower.DisplayObject = this.getMouseTarget(x, y, mouse.mutiply);
            mouse.target = target;
            var parent = target.parent;
            while (parent && parent != this) {
                mouse.parents.push(parent);
                parent = parent.parent;
            }
            //target.addListener(flower.Event.REMOVED, this.onMouseTargetRemove, this);
            if (target) {
                var event:flower.TouchEvent = new flower.TouchEvent(flower.TouchEvent.TOUCH_BEGIN);
                event.stageX = x;
                event.stageY = y;
                event.$target = target;
                event.touchX = Math.floor(target.touchX);
                event.touchY = Math.floor(target.touchY);
                target.dispatch(event);
            }
        }

        public onMouseMove(id:number, x:number, y:number) {
            var mouse:any;
            for (var i:number = 0; i < this.touchList.length; i++) {
                if (this.touchList[i].id == id) {
                    mouse = this.touchList[i];
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
            if(!mouse.target) {
                mouse.target = this;
            }
            this.getMouseTarget(x, y, mouse.mutiply);
            var target:flower.DisplayObject = mouse.target;//this.getMouseTarget(x, y, mouse.mutiply);
            mouse.moveX = x;
            mouse.moveY = y;
            var event:flower.TouchEvent;
            if (target) {
                event = new flower.TouchEvent(flower.TouchEvent.TOUCH_MOVE);
                event.stageX = x;
                event.stageY = y;
                event.$target = target;
                event.touchX = Math.floor(target.touchX);
                event.touchY = Math.floor(target.touchY);
                target.dispatch(event);
            }
        }

        public onMouseUp(id:number, x:number, y:number) {
            var mouse:any;
            for (var i:number = 0; i < this.touchList.length; i++) {
                if (this.touchList[i].id == id) {
                    mouse = this.touchList.splice(i, 1)[0];
                    break;
                }
            }
            if (mouse == null) {
                return;
            }
            while (mouse.target.stage == null && mouse.parents.length) {
                mouse.target = mouse.parents.shift();
            }
            if(!mouse.target) {
                mouse.target = this;
            }
            var target:flower.DisplayObject = this.getMouseTarget(x, y, mouse.mutiply);
            var event:flower.TouchEvent;
            if (target == mouse.target) {
                event = new flower.TouchEvent(flower.TouchEvent.TOUCH_END);
                event.stageX = x;
                event.stageY = y;
                event.$target = target;
                event.touchX = Math.floor(target.touchX);
                event.touchY = Math.floor(target.touchY);
                target.dispatch(event);
            }
            else {
                target = mouse.target;
                event = new flower.TouchEvent(flower.TouchEvent.TOUCH_RELEASE);
                event.stageX = x;
                event.stageY = y;
                event.$target = target;
                event.touchX = Math.floor(target.touchX);
                event.touchY = Math.floor(target.touchY);
                target.dispatch(event);
            }
        }

        public get stageWidth():number {
            return System.width;
        }

        public get stageHeight():number {
            return System.height;
        }

    }
}

flower.Stage.stages = [];
