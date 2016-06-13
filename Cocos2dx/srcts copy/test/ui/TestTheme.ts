module test {
    export class TestTheme extends flower.Group {
        public constructor() {
            super();
            this.percentWidth = this.percentHeight = 100;
            var theme = new flower.Theme("res/theme/black/theme.json");
            theme.addListener(flower.Event.COMPLETE, this.loadComplete, this);
        }

        private loadComplete(e:flower.Event) {
            var theme = <flower.Theme>e.currentTarget;
            theme.useTheme();
            var parse = new flower.UIParser();
            parse.parseUIAsync("res/uxml/Panel.xml")
            parse.addListener(flower.Event.COMPLETE, this.onLoadPanelComplete, this);
        }

        private onLoadPanelComplete(e:flower.Event) {
            this.addChild(e.data);
        }
    }
}