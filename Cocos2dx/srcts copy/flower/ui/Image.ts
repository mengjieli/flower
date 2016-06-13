module flower {
    export class Image extends flower.Bitmap implements flower.UIComponent {

        private _loader:flower.EventDispatcher;
        private _source:any;

        public constructor(source:any = null) {
            super();
            flower.Component.init(this);
            if (source) {
                this.setSource(source);
            }
        }

        private setSource(val:string|ResItem|flower.Texture2D) {
            if (val == "" || val == null) {
                this.texture = null;
                return;
            }
            if (this._loader) {
                this._loader.dispose();
                this._loader = null;
            }
            if (val instanceof flower.Texture2D) {
                this.texture = <flower.Texture2D>val;
            } else {
                var url:string;
                if (typeof (val) == "string") {
                    url = <string>val;
                } else {
                    url = (<ResItem>val).url;
                }
                var arr = url.split("#");
                if (arr.length == 2 || arr.length == 3) {
                    var pluginName;
                    var fileEnd;
                    if (arr.length == 3) {
                        pluginName = arr[2];
                    } else {
                        fileEnd = Path.getFileEnd(arr[0]);
                    }
                    var plugin = ImagePlugin.getPlugin(fileEnd, pluginName);
                    if (plugin == null) {
                        flower.DebugInfo.debug("没有找到 Image 对应的插件:" + url, flower.DebugInfo.ERROR);
                    }
                    url = arr[0] + "#" + arr[1];
                    var texture = plugin.getTextrure(url);
                    if (texture) {
                        this.texture = texture;
                    } else {
                        this._loader = plugin.load(<string|ResItem>val);
                        this._loader.addListener(flower.Event.COMPLETE, this.onLoadTextureComplete, this);
                    }
                } else {
                    this._loader = new flower.URLLoader(<string|ResItem>val);
                    this._loader.addListener(flower.Event.COMPLETE, this.onLoadTextureComplete, this);
                }
            }
        }

        public _setTexture(val:flower.Texture2D) {
            super._setTexture(val);
            this.$addFlag(0x200);
        }

        public set src(val:any) {
            if (this._source == val) {
                return;
            }
            this._source = val;
            this.setSource(val);
        }

        public get src():any {
            return this._source;
        }

        private onLoadTextureComplete(e:flower.Event) {
            this._loader = null;
            this.texture = e.data;
        }

        public $onFrameEnd() {
            super.$onFrameEnd.call(this);
            this.resetUIProperty();
        }

        public dispose() {
            if (this._loader) {
                this._loader.dispose();
                this._loader = null;
            }
            for (var key in this._binds) {
                this._binds[key].dispose();
            }
            this._binds = null;
            super.dispose.call(this);
        }

        public get offX():number {
            return this.texture ? this.texture.offX : 0;
        }

        public get offY():number {
            return this.texture ? this.texture.offY : 0;
        }

        //////////////////////////////////interface//////////////////////////////////
        private _binds;
        public eventThis;
        public onAdded;
        public absoluteState;
        public state;
        public currentState;
        public topAlgin;
        public bottomAlgin;
        public leftAlgin;
        public rightAlgin;
        public horizontalCenterAlgin;
        public verticalCenterAlgin;
        public top;
        public bottom;
        public left;
        public right;
        public horizontalCenter;
        public verticalCenter;
        public percentWidth;
        public percentHeight;

        public bindProperty(property:string, content:string, checks:Array<any> = null) {
        }

        public removeBindProperty(property:string) {
        }

        public setStatePropertyValue(property:string, state:string, val:string, checks:Array<any> = null) {

        }

        public changeState(state:string):string {
            return "";
        }

        protected resetUIProperty():void {

        }
    }
    flower.Component.register(Image);
}

