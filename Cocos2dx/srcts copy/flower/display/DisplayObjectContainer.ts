module flower {
    export interface DisplayObjectContainer {
        addChild(child:flower.DisplayObject);
        getChildAt(index:number):flower.DisplayObject;
        addChildAt(child:flower.DisplayObject, index?:number);
        removeChild(child:flower.DisplayObject);
        removeChildAt(index:number);
        removeAll();
        setChildIndex(child:flower.DisplayObject, index:number);
        getChildIndex(child:flower.DisplayObject):number;
        contains(child:flower.DisplayObject):boolean;
        $nativeShow:any;
        x:number;
        y:number;
        width:number;
        height:number;
        scaleX:number;
        scaleY:number;
        rotation:number;
        mesureWidth:number;
        mesureHeight:number;
        parent:DisplayObjectContainer;
        once(type:string, listener:Function, thisObject:any);
        addListener(type:string, listener:Function, thisObject:any);
        removeListener(type:string, listener:Function, thisObject:any);
        sortChild(key:string, opt?:number);
        removeAllListener();
        hasListener(type:string):boolean;
        dispatch(event:flower.Event);
        dispatchWidth(type:string, data?:any);
        dispose();
        $addFlag(pos:number);
        $getFlag(pos:number):boolean;
    }
}

