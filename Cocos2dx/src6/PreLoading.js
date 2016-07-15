class PreLoading extends flower.EventDispatcher {

    progressBar;
    modules;
    index;
    module;
    progress;

    constructor() {
        super();

        this.progress = new flower.NumberValue();
        this.modules = [
            new flower.Module("modules/software/module.json"),
            new flower.Module("modules/gameEditor/module.json")
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
        this.loadNextModule();
    }

    loadNextModule() {
        if (this.index < this.modules.length) {
            this.module = this.modules[this.index];
            this.module.progress.percent.addListener(flower.Event.UPDATE, this.onUpdate, this);
            this.module.load();
        } else {
            this.dispose();
        }
    }

    onUpdate(e) {
        var data = this.module.progress;
        this.progress.value = (this.index + data.percent.value) / this.modules.length;
        if (data.percent.value == 1) {
            this.index++;
            this.loadNextModule();
        }
    }

    dispose() {
        this.dispatchWidth(flower.Event.COMPLETE);
        this.progress.dispose();
        this.progressBar.dispose();
        super.dispose();
    }
}