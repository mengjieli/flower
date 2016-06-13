module ImagePlugin {

    export class PlistMananger implements flower.IImagePlugin {

        private plists:Array<Plist> = [];
        private caches:Object = {};
        private loadingPlist:Array<PlistLoader> = [];

        public constructor() {

        }

        public addPlist(plist:Plist) {
            this.plists.push(plist);
        }

        public addPlistWidthConfig(content:string) {

        }

        public cache(url:string) {
            this.caches[url] = true;
        }

        public delCache(url:string) {
            delete this.caches[url];
        }

        public getPlist(url:string):Plist {
            for (var i = 0, len = this.plists.length; i < len; i++) {
                if (this.plists[i].url == url) {
                    return this.plists[i];
                }
            }
            return null;
        }

        public load(res:string|flower.ResItem):ImagePlugin.PlistLoader {
            var loader:ImagePlugin.PlistLoader;
            var list = this.loadingPlist;
            var url:string;
            for (var i = 0, len = list.length; i < len; i++) {
                if (typeof(res) == "string") {
                    url = <string>res;
                } else {
                    url = (<flower.ResItem>res).url;
                }
                if (url == list[i].url) {
                    loader = list[i];
                    break;
                }
            }
            if (!loader) {
                loader = new ImagePlugin.PlistLoader(res);
            }
            return loader;
        }

        public getTextrure(url:string):flower.Texture2D {
            var arr = url.split("#");
            var plistURL = arr[0];
            var frameName = arr[1];
            var plist = this.getPlist(url);
            if (!plist) {
                return null;
            }
            var texture = plist.getFrameTexture(frameName);
            if (!texture || texture.hasDispose == false) {
                return null;
            }
            return texture;
        }

        private static instance:PlistMananger = new PlistMananger();

        public static getInstance():PlistMananger {
            return PlistMananger.instance;
        }
    }

    flower.ImagePlugin.registerPlugin("PLIST",["plist"], PlistMananger.getInstance());
}