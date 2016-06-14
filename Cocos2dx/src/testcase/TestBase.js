"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TestBase = function () {
    function TestBase() {
        _classCallCheck(this, TestBase);

        this.cases = [];
    }

    /**
     * 测试列子
     * @type {Array}
     */


    _createClass(TestBase, [{
        key: "addCase",
        value: function addCase(testCase) {
            this.cases.push(testCase);
        }
    }, {
        key: "test",
        value: function test() {
            for (var i = 0; i < this.cases.length; i++) {
                this.cases[i].test();
            }
        }
    }, {
        key: "completeFlag",
        get: function get() {
            for (var i = 0; i < this.cases.length; i++) {
                if (this.cases[i].completeFlag == false) {
                    return false;
                }
            }
            return true;
        }
    }, {
        key: "count",
        get: function get() {
            return this.cases.length;
        }
    }, {
        key: "successCount",
        get: function get() {
            var num = 0;
            for (var i = 0; i < this.cases.length; i++) {
                num += this.cases[i].success ? 1 : 0;
            }
            return num;
        }
    }]);

    return TestBase;
}();