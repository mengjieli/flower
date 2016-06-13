module flower {
    export interface IViewPort extends flower.DisplayObject {
        contentWidth:number;
        contentHeight:number;
        scrollEnabled:boolean;
        layout:Layout;
        viewer:DisplayObject;
        onScroll();
        $releaseItem();
    }
}