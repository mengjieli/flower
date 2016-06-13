module flower {
	export interface IPlugin {

		init(tween:flower.Tween,propertiesTo:any,propertiesFrom:any):Array<string>;
		update(value:number);
	}
}

