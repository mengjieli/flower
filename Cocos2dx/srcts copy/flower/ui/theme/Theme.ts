module flower {
    export class Theme extends EventDispatcher {

        private config:Object;
        private direction:string;

        public constructor(res:string|ResItem) {
            super();
            var load = new URLLoader(res);
            load.addListener(flower.Event.COMPLETE, this.onLoadComplete, this);
            this.direction = Path.getPathDirection(load.url);
        }

        private onLoadComplete(e:flower.Event) {
            this.config = e.data;
            this.dispatchWidth(flower.Event.COMPLETE);
        }

        public useTheme() {
            if (this.config == null) {
                return;
            }
            for (var key in this.config) {
                if (key == "Label") {
                    for(var atr in this.config[key]) {
                        Label.theme[atr] = this.config[key][atr];
                    }
                } else {
                    var url = this.config[key];
                    if(url.slice(0,2) == "./") {
                        url = this.direction + url.slice(2,url.length);
                    }
                    trace("Path?",key,url);
                    UIParser.setLocalUIURL(key, url);
                }
            }
        }
    }
}