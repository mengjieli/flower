class TestCase {

    success = null;

    constructor(name, result, testFunction) {
        this.name = name;
        this.result = result;
        this.testFunction = testFunction;
    }

    test() {
        this.success = null;
        this.testFunction.apply(this);
    }

    get completeFlag() {
        return this.success == null ? false : true;
    }

    getResult(result) {
        if (result == this.result) {
            this.success = true;
            //console.log("[TestCase success] " + this.name);
        } else {
            this.success = false;
            console.log("[TestCase Fail] " + this.name + " . The result should be \"" + this.result + "\" ,but get result \"" + result + "\"");
        }
    }
}