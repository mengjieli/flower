class PreLoading extends flower.EventDispatcher {

    progressBar;
    themes;
    index;
    theme;
    progress;

    constructor() {
        super();

        this.progress = new flower.NumberValue();
        this.themes = [
            new flower.Theme("res/software/theme.json"),
            new flower.Theme("res/gameEditor/theme.json")
        ];
        this.progressBar = (new flower.UIParser()).parseUI(`
        <f:Group width="150" height="20" class="PreLoading" xmlns:f="flower">
            <f:script src="./PreLoading.js"/>
            <f:RectUI percentWidth="100" percentHeight="100" lineColor="0x333333" lineWidth="1" fillColor="0xE7E7E7"/>
            <f:RectUI percentWidth="{data*100}" percentHeight="100" fillColor="0x3d3d3d"/>
        </f:Group>
        `, this.progress);
        flower.PopManager.pop(this.progressBar, true, true);
        this.index = 0;
        this.loadNextTheme();
    }

    loadNextTheme() {
        if (this.index < this.themes.length) {
            this.theme = this.themes[this.index];
            this.theme.progress.percent.addListener(flower.Event.UPDATE, this.onUpdate, this);
            this.theme.load();
        } else {
            this.dispose();
        }
    }

    onUpdate(e) {
        var data = this.theme.progress;
        this.progress.value = (this.index + data.percent.value) / this.themes.length;
        if (data.percent.value == 1) {
            this.index++;
            this.loadNextTheme();
        }
    }

    dispose() {
        this.dispatchWidth(flower.Event.COMPLETE);
        this.progress.dispose();
        this.progressBar.dispose();
        super.dispose();
    }
}