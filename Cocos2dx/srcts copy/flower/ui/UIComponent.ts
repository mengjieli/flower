module flower {
    export interface UIComponent {
        onAdded:Function;
        absoluteState:boolean;
        state:flower.StringValue;
        currentState:string;
        topAlgin:string;
        bottomAlgin:string;
        leftAlgin:string;
        rightAlgin:string;
        horizontalCenterAlgin:string;
        verticalCenterAlgin:string;
        top:number;
        bottom:number;
        left:number;
        right:number;
        horizontalCenter:number;
        verticalCenter:number;
        percentWidth:number;
        percentHeight:number;
        bindProperty(property:string, content:string, checks:Array<any>);
        removeBindProperty(property:string);
        setStatePropertyValue(property:string, state:string, val:string, checks:Array<any>);
        changeState(state:string):string;
    }
}

