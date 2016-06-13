module flower {
    export interface IImagePlugin {
        load(res:string|ResItem):flower.EventDispatcher;
        getTextrure(res:string):flower.Texture2D;
    }
}