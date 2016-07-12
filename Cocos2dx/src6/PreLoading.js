class PreLoading extends flower.EventDispatcher {

    progressBar;

    constructor() {
        super();

        var theme = new flower.Theme("softwareRes/theme/theme.json");
        theme.load();

        this.progressBar = (new flower.UIParser()).parseUI(`
        <f:Group width="150" height="20" class="PreLoading" xmlns:f="flower">
            <f:script src="./PreLoading.js"/>
            <f:RectUI percentWidth="100" percentHeight="100" lineColor="0x333333" lineWidth="1" fillColor="0xE7E7E7"/>
            <f:RectUI percentWidth="{data.percent*100}" percentHeight="100" fillColor="0x3d3d3d"/>
        </f:Group>
        `, theme.progress);

        var data = this.progressBar.data;
        data.percent.addListener(flower.Event.UPDATE, this.onUpdate, this);
        flower.PopManager.pop(this.progressBar, true, true);
    }

    onUpdate(e) {
        var data = this.progressBar.data;
        if (data.percent.value == 1) {
            this.dispose();
            //new flower.CallLater(this.dispose, this);
        }
    }

    dispose() {
        this.dispatchWidth(flower.Event.COMPLETE);
        this.progressBar.data.percent.removeListener(flower.Event.UPDATE, this.onUpdate, this);
        this.progressBar.dispose();
        super.dispose();
    }
}