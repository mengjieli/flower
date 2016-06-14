class TestBase {

    /**
     * 测试列子
     * @type {Array}
     */
    cases = [];

    constructor() {
    }

    addCase(testCase) {
        this.cases.push(testCase);
    }

    test() {
        for (var i = 0; i < this.cases.length; i++) {
            this.cases[i].test();
        }
    }

    get completeFlag() {
        for (var i = 0; i < this.cases.length; i++) {
            if (this.cases[i].completeFlag == false) {
                return false;
            }
        }
        return true;
    }

    get count() {
        return this.cases.length;
    }

    get successCount() {
        var num = 0;
        for (var i = 0; i < this.cases.length; i++) {
            num += this.cases[i].success ? 1 : 0;
        }
        return num;
    }
}