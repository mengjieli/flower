module test {
    export class TestUI extends flower.Sprite {

        public constructor() {
            super();

            flower.Engine.getInstance().addChild(new test.TestTheme());
            //flower.Engine.getInstance().addChild(new test.TestUpdateUI());
            flower.UIParser.registerLocalUIClass("test.LabelItem", test.LabelItem);
            //this.addChild(new test.TestUpdateUI());
            //this.addChild(new test.TestLayout());

            //flower.Engine.getInstance().addChild(this);
            //var group = new flower.DataGroup();
            //this.addChild(group);
            //group.itemRender = LabelItem;
            //group.layout = new flower.VerticalLayout();
            //var data = new flower.ArrayValue();
            //data.push({label: "文字1"});
            //data.push({label: "文字2"});
            //data.push({label: "文字3"});
            //data.push({label: "文字4"});
            //data.push({label: "文字5"});
            //group.dataProvider = data;
            //
            //this.addListener(flower.TouchEvent.TOUCH_BEGIN,function(e:flower.TouchEvent){
            //    data.push({label:"额" + Math.floor(Math.random()*1000)});
            //},this);
        }
    }

    export class LabelItem extends flower.ItemRenderer {
        private label:flower.Label;

        public constructor() {
            super();
            this.label = new flower.Label();
            this.label.color = 0xff00ff;
            this.addChild(this.label);
            this.percentWidth = 100;
            this.height = 20;
        }

        protected setData(val:any) {
            this.label.text = val.label;
        }
    }
}

