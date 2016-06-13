module flower {
	export class TouchEvent extends flower.Event {
		public static TOUCH_BEGIN:string;
		public static TOUCH_MOVE:string;
		public static TOUCH_END:string;
		public static TOUCH_RELEASE:string;
		public touchX:number;
		public touchY:number;
		public stageX:number;
		public stageY:number;

		public constructor(type:string,bubbles:boolean = true)
		{
			super(type,bubbles);
		}

	}
}

flower.TouchEvent.TOUCH_BEGIN = "touch_begin";
flower.TouchEvent.TOUCH_MOVE = "touch_move";
flower.TouchEvent.TOUCH_END = "touch_end";
flower.TouchEvent.TOUCH_RELEASE = "touch_release";
