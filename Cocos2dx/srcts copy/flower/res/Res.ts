module flower {
    export class Res {
        public static local:boolean;
        public static localURL:string;
        public static serverURL:string;

        public static getEndType(end:string) {
            if (end == "png" || end == "jpg") {
                return flower.ResType.TEXTURE;
            }
            else if (end == "json") {
                return flower.ResType.JSON;
            }
            else {
                return flower.ResType.TEXT;
            }
            return "";
        }
    }
}

flower.Res.local = true;
flower.Res.localURL = "";
flower.Res.serverURL = "";
