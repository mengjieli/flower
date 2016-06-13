module flower {
    export class ProgrammerManager {

        private programmers = [];

        public constructor() {

        }

        public createProgrammer():Programmer {
            if (this.programmers.length) {
                return this.programmers.pop();
            }
            return new Programmer();
        }

        public releaseProgrammer(programmer:Programmer) {
            this.programmers.push(programmer);
        }

        public registerProgrammer(type:string, clazz:any) {
            this.programmers[type] = {
                "class": clazz,
                "list": []
            }
        }

        private static ist = new ProgrammerManager();

        public static getInstance():ProgrammerManager {
            return ProgrammerManager.ist;
        }
    }
}