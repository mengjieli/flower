"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TestCase = function () {
    function TestCase(name, result, testFunction) {
        _classCallCheck(this, TestCase);

        this.success = null;

        this.name = name;
        this.result = result;
        this.testFunction = testFunction;
    }

    _createClass(TestCase, [{
        key: "test",
        value: function test() {
            this.success = null;
            this.testFunction.apply(this);
        }
    }, {
        key: "getResult",
        value: function getResult(result) {
            if (result == this.result) {
                this.success = true;
                //console.log("[TestCase success] " + this.name);
            } else {
                    this.success = false;
                    console.log("[TestCase Fail] " + this.name + " . The result should be \"" + this.result + "\" ,but get result \"" + result + "\"");
                }
        }
    }, {
        key: "completeFlag",
        get: function get() {
            return this.success == null ? false : true;
        }
    }]);

    return TestCase;
}();