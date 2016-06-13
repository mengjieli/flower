module flower {
    export interface ICollection extends flower.EventDispatcher {
        length:number;
        getItemAt(index:number):any;
        getItemIndex(item:any):number;
    }
}