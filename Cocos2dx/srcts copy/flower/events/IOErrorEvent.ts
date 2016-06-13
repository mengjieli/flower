module flower {
    export class IOErrorEvent extends flower.Event {

        public static ERROR:string = "error";

        private _message:string;

        public constructor(type:string, message:string) {
            super(type);
        }

        public get message():string {
            return this._message;
        }

    }
}
