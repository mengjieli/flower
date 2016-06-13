var global:any = this;

class System {

    public static IDE:String = "cocos2dx";
    public static stage:any;
    public static local:boolean = true;
    public static receverY:boolean = true;
    public static width:number;
    public static height:number;
    public static global:any = global;

    public static start(root:any, debugRoot:any, engine:any):void {
        var scene:any = cc.Scene.extend({
            ctor: function () {
                this._super();
                this.scheduleUpdate();
                //注册鼠标事件
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchesBegan.bind(this),
                    onTouchMoved: this.onTouchesMoved.bind(this),
                    onTouchEnded: this.onTouchesEnded.bind(this)
                }, this);
            },
            update: function (dt) {
                trace("dt", dt);
            },
            onTouchesBegan: function (touch:any) {
                engine.onMouseDown(touch.getID(), Math.floor(touch.getLocation().x), System.height - Math.floor(touch.getLocation().y));
                return true;
            },
            onTouchesMoved: function (touch:any) {
                engine.onMouseMove(touch.getID(), Math.floor(touch.getLocation().x), System.height - Math.floor(touch.getLocation().y));
                return true;
            },
            onTouchesEnded: function (touch:any) {
                engine.onMouseUp(touch.getID(), Math.floor(touch.getLocation().x), System.height - Math.floor(touch.getLocation().y));
                return true;
            },
        });
        System.stage = new scene();
        System.stage.update = System._run;
        cc.director.runScene(System.stage);
        System.width = cc.Director.getInstance().getWinSize().width;
        System.height = cc.Director.getInstance().getWinSize().height;
        root.setPositionY(System.height);
        debugRoot.setPositionY(System.height);
        System.stage.addChild(root);
        System.stage.addChild(debugRoot);
        System.$mesureTxt.retain();
    }


    private static webSockets = [];

    public static bindWebSocket(ip:string, port:number, thisObj:any, onConnect:Function, onReceiveMessage:Function, onError:Function, onClose:Function):any {
        var websocket = new WebSocket("ws://" + ip + ":" + port);
        var openFunc = function ():void {
            onConnect.call(thisObj);
        };
        websocket.onopen = openFunc;
        var receiveFunc = function (event):void {
            if (event.data instanceof ArrayBuffer) {
                var list = [];
                var data = new Uint8Array(event.data);
                for (var i = 0; i < data.length; i++) {
                    list.push(data[i]);
                }
                onReceiveMessage.call(thisObj, "buffer", list);
            } else {
                onReceiveMessage.call(thisObj, "string", event.data);
            }
        };
        websocket.onmessage = receiveFunc;
        var errorFunc = function ():void {
            onError.call(thisObj);
        };
        websocket.onerror = errorFunc;
        var closeFunc = function ():void {
            onClose.call(thisObj);
        };
        websocket.onclose = closeFunc;
        System.webSockets.push({
            "webSocket": websocket
        });
        return websocket;
    }

    public static sendWebSocketUTF(webSocket:any, data:string):void {
        webSocket.send(data);
    }

    public static sendWebSocketBytes(webSocket:any, data:any):void {
        webSocket.send(new Uint8Array(data));
    }

    public static releaseWebSocket(websocket):void {
        var item:any = null;
        var list = System.webSockets;
        for (var i = 0; i < list.length; i++) {
            if (websocket == list[i].webSocket) {
                websocket.close();
                websocket.onopen = null;
                websocket.onmessage = null;
                websocket.onerror = null;
                websocket.onclose = null;
                list.splice(i, 1);
                break;
            }
        }
    }

    public static numberToString(arr:any):string {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] < 0) arr[i] += 256;
        }
        var res = [];
        for (i = 0; i < arr.length; i++) {
            if (arr[i] == 0)break;
            if ((arr[i] & 128) == 0) res.push(arr[i]);				//1位
            else if ((arr[i] & 64) == 0) res.push(arr[i] % 128);		//1位
            else if ((arr[i] & 32) == 0)	//2位
            {
                res.push((arr[i] % 32) * 64 + (arr[i + 1] % 64));
                i++;
            }
            else if ((arr[i] & 16) == 0)	//3位
            {
                res.push((arr[i] % 16) * 64 * 64 + (arr[i + 1] % 64) * 64 + (arr[i + 2] % 64));
                i++;
                i++;
            }
            else if ((arr[i] & 8) == 0)	//4位
            {
                res.push((arr[i] % 8) * 64 * 64 * 64 + (arr[i + 1] % 64) * 64 * 64 + (arr[i + 2] % 64) * 64 + (arr[i + 2] % 64));
                i++;
                i++;
                i++;
            }
        }
        var str = "";
        for (i = 0; i < res.length; i++) {
            str += String.fromCharCode(res[i]);
        }
        return str;
    }

    public static stringToBytes(str:string):any {
        var res = [];
        var num;
        for (var i = 0; i < str.length; i++) {
            num = str.charCodeAt(i);
            if (num < 128) {
                res.push(num);
            }
            else if (num < 2048) {
                res.push(Math.floor(num / 64) + 128 + 64);
                res.push((num % 64) + 128);
            }
            else if (num < 65536) {
                res.push(Math.floor(num / 4096) + 128 + 64 + 32);
                res.push(Math.floor((num % 4096) / 64) + 128);
                res.push((num % 64) + 128);
            }
            else {
                res.push(Math.floor(num / 262144) + 128 + 64 + 32 + 16);
                res.push(Math.floor((num % 262144) / 4096) + 128);
                res.push(Math.floor((num % 4096) / 64) + 128);
                res.push((num % 64) + 128);
            }
        }
        return res;
    }

    public static getTime():number {
        return (new Date()).getTime();
    }

    public static disposeTexture(nativeTexture:any, url:string):void {
        cc.TextureCache.getInstance().removeTextureForKey(url);
    }

    public static log(...args):void {
        var str:String = "";
        for (var i = 0; i < args.length; i++) {
            str += args[i] + (i < args.length - 1 ? "  " : "");
        }
        console.log(str);
    }

    public static JSON_parser:Function = JSON.parse;
    public static JSON_stringify:Function = JSON.stringify;

    public static runTimeLine(back:Function):void {
        System._runBack = back;
    }

    private static _runBack:Function;
    private static lastTime:number = (new Date()).getTime();
    private static frame:number = 0;

    private static _run():void {
        System.frame++;
        var now = (new Date()).getTime();
        System._runBack(now - System.lastTime);
        System.lastTime = now;
        if (System.loadingList.length) {
            var item = System.loadingList.shift();
            item[0](item[1], item[2], item[3], item[4]);
        }
    }

    public static isLoading = false;
    public static loadingList = [];
    public static URLLoader:any = {
        "loadText": {
            "func": function (url, back, errorBack, thisObj) {
                if (System.isLoading) {
                    System.loadingList.push([System.URLLoader.loadText.func, url, back, errorBack, thisObj]);
                    return;
                }
                System.isLoading = true;
                if(flower.Engine.TIP) {
                    flower.DebugInfo.debug("[loadText] " + url,flower.DebugInfo.TIP);
                }
                if (url.slice(0, "http://".length) == "http://") {
                    var xhr = cc.loader.getXMLHttpRequest();
                    xhr.open("GET", url, true);
                    xhr.onloadend = function () {
                        if (xhr.status != 200) {
                            errorBack.call(thisObj);
                        } else {
                            back.call(thisObj, xhr.responseText);
                        }
                        System.isLoading = false;
                    };
                    xhr.send();
                } else {
                    cc.loader.loadTxt(url, function (error, data) {
                        if (error) {
                            errorBack.call(thisObj);
                        }
                        else {
                            back.call(thisObj, data);
                        }
                        System.isLoading = false;
                    });
                }
            }
        },
        "loadTexture": {
            "func": function (url, back, errorBack, thisObj) {
                if (System.isLoading) {
                    System.loadingList.push([System.URLLoader.loadTexture.func, url, back, errorBack, thisObj]);
                    return;
                }
                System.isLoading = true;
                if(flower.Engine.TIP) {
                    flower.DebugInfo.debug("[loadTexture] " + url,flower.DebugInfo.TIP);
                }
                cc.loader.loadImg(url, {isCrossOrigin: true}, function (err, img) {
                    if (err) {
                        errorBack.call(thisObj);
                    }
                    else {
                        var texture = img;
                        back.call(thisObj, texture, texture.getContentSize().width, texture.getContentSize().height);
                    }
                    System.isLoading = false;
                });
            }
        }
    }

    public static getNativeShow(className:string):any {
        if (System.nativeShows[className].length) {
            var show:any = System.nativeShows[className].pop();
            return show;
        }
        //trace("[New native show]", className);
        if (className == "DisplayObjectContainer") {
            var node = new cc.Node();
            node.setAnchorPoint(0, 0);
            node.retain();
            return node;
        }
        if (className == "Bitmap") {
            var bm = new cc.Sprite();
            bm.setAnchorPoint(0, 0);
            bm.retain();
            return bm;
        }
        if (className == "TextField") {
            var txt = new cc.LabelTTF("", "Times Roman", 12);
            txt.setAnchorPoint(0, 1);
            txt.retain();
            return txt;
        }
        if (className == "Shape") {
            var shape = new cc.DrawNode();
            shape.retain();
            return shape;
        }
        if (className == "Mask") {
            var mask = new cc.ClippingNode();
            mask.retain();
            return mask;
        }
        return null;
    }

    private static nativeShows = {
        "DisplayObjectContainer": [],
        "Bitmap": [],
        "TextField": [],
        "Shape": [],
        "Mask": []
    };

    public static cycleNativeShow(className, show:any):void {
        show.setPosition(0, 0);
        show.setScale(1);
        show.setOpacity(255);
        show.setRotation(0);
        show.setVisible(true);
        System.nativeShows[className].push(show);
    }

    public static DisplayObject:any = {
        "x": {"func": "setPositionX"},
        "y": {"func": "setPositionY"},
        "scaleX": {"func": "setScaleX"},
        "scaleY": {"func": "setScaleY"},
        "rotation": {"func": "setRotation", "scale": 1},
        "alpha": {"func": "setOpacity", "scale": 255},
        "visible": {"func": "setVisible"}
    }

    public static DisplayObjectContainer:Object = {
        "setChildIndex": {"func": "setZOrder"}
    }

    public static Bitmap:any = {
        "texture": {
            "exe": function (nativeShow, nativeTexture, resource, rotation) {
                nativeShow.initWithTexture(nativeTexture);
                if (resource) {
                    nativeShow.setTextureRect(resource, rotation, {width: resource.width, height: resource.height});
                }
            }
        }
    }

    public static Shape:any = {
        "clear": function (shape:any):void {
            shape.clear();
        },
        "draw": function (shape:any, points:Array<any>, fillColor:number, fillAlpha:number, lineWidth:number, lineColor:number, lineAlpha:number):void {
            for (var i = 0; i < points.length; i++) {
                points[i].y = -points[i].y;
            }
            shape.drawPoly(points, {
                r: fillColor >> 16,
                g: fillColor >> 8 & 0xFF,
                b: fillColor & 0xFF,
                a: fillAlpha * 255
            }, lineWidth, {
                r: lineColor >> 16,
                g: lineColor >> 8 & 0xFF,
                b: lineColor & 0xFF,
                a: lineAlpha * 255
            });
            for (var i = 0; i < points.length; i++) {
                points[i].y = -points[i].y;
            }
        }
    }

    public static Mask:any = {
        "init": function (show, mask) {
            show.setStencil(mask);
        }
    }

    private static $mesureTxt = new cc.LabelTTF("", "Times Roman", 12);
    public static TextField:any = {
        "color": {
            "exe": function (txt, color:number):void {
                txt.setFontFillColor({r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF}, true);
            }
        },
        "size": {"func": "setFontSize"},
        "resetText": function (txt, text, width, height, size, wordWrap, multiline, autoSize):void {
            System.$mesureTxt.setFontSize(size);
            txt.text = "";
            var txtText:String = "";
            var start = 0;
            for (var i = 0; i < text.length; i++) {
                //取一行文字进行处理
                if (text.charAt(i) == "\n" || text.charAt(i) == "\r" || i == text.length - 1) {
                    var str:String = text.slice(start, i);
                    System.$mesureTxt.setString(str);
                    var lineWidth = System.$mesureTxt.getContentSize().width;
                    var findEnd = i;
                    var changeLine = false;
                    //如果这一行的文字宽大于设定宽
                    while (!autoSize && lineWidth > width) {
                        changeLine = true;
                        findEnd--;
                        System.$mesureTxt.setString(text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                        lineWidth = System.$mesureTxt.getContentSize().width;
                    }
                    if (wordWrap && changeLine) {
                        i = findEnd;
                        txt.setString(txtText + "\n" + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                    } else {
                        txt.setString(txtText + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                    }
                    //如果文字的高度已经大于设定的高，回退一次
                    if (!autoSize && txt.getContentSize().height > height) {
                        txt.setString(txtText);
                        break;
                    } else {
                        txtText += text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                        if (wordWrap && changeLine) {
                            txtText += "\n";
                        }
                    }
                    start = i;
                    if (multiline == false) {
                        break;
                    }
                }
            }
        },
        "mesure": function (txt):Object {
            return txt.getContentSize();
        }
    }


}

