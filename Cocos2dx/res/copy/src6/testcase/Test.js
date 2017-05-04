class Test {
    constructor() {
        var list = [
            new TestEvent()
        ];
        for (var i = 0; i < list.length; i++) {
            list[i].test();
        }

        function isComplete() {
            for (var i = 0; i < list.length; i++) {
                if (list[i].completeFlag == false) {
                    setTimeout(isComplete, 100);
                    return;
                }
            }
            var all = 0;
            var num = 0;
            for (var i = 0; i < list.length; i++) {
                all += list[i].count;
                num += list[i].successCount;
            }
            console.log("Test complete, success rate " + num + "/" + all + ".");
        }

        isComplete();

    }
}