module flower {
    export class Event {

        private $type:string;
        private $bubbles:boolean;
        private $cycle:boolean = false;
        public $target:any = null;
        public $currentTarget:any = null;
        public data:any;
        private _isPropagationStopped:boolean = false;

        public constructor(type:string, bubbles:boolean = false) {
            this.$type = type;
            this.$bubbles = bubbles;
        }

        public stopPropagation() {
            this._isPropagationStopped = true;
        }

        public get isPropagationStopped():boolean {
            return this._isPropagationStopped;
        }

        public get type():string {
            return this.$type;
        }

        public get bubbles():boolean {
            return this.$bubbles;
        }

        public get target():any {
            return this.$target;
        }

        public get currentTarget():any {
            return this.$currentTarget;
        }

        public static READY:string = "ready";
        public static COMPLETE:string = "complete";
        public static ADDED:string = "added";
        public static REMOVED:string = "removed";
        public static ADDED_TO_STAGE:string = "added_to_stage";
        public static REMOVED_FROM_STAGE:string = "removed_from_stage";
        public static CONNECT:string = "connect";
        public static CLOSE:string = "close";
        public static CHANGE:string = "change";
        public static ERROR:string = "error";
        public static UPDATE:string = "update";

        public static _eventPool:Array<flower.Event> = new Array<flower.Event>();

        public static create(type:string, data:any = null):flower.Event {
            var e:flower.Event;
            if (!flower.Event._eventPool.length) {
                e = new flower.Event(type);
            }
            else {
                e = flower.Event._eventPool.pop();
                e.$cycle = false;
            }
            e.$type = type;
            e.$bubbles = false;
            e.data = data;
            return e;
        }

        public static release(e:flower.Event) {
            if (e.$cycle) {
                return;
            }
            e.$cycle = true;
            e.data = null;
            flower.Event._eventPool.push(e);
        }

    }
}
