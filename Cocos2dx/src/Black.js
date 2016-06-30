"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var black = {};
var $root = eval("this");
(function () {
    //////////////////////////File:extension/ui/core/UIComponent.js///////////////////////////

    var UIComponent = function () {
        function UIComponent() {
            _classCallCheck(this, UIComponent);
        }

        _createClass(UIComponent, null, [{
            key: "register",
            value: function register(clazz) {
                var p = clazz.prototype;
                p.$initUIComponent = function () {
                    this.$UIComponent = {
                        0: null, //left
                        1: null, //right
                        2: null, //horizontalCenter
                        3: null, //top
                        4: null, //bottom
                        5: null, //verticalCenter
                        6: null, //percentWidth
                        7: null, //percentHeight
                        8: null, //uiWidth
                        9: null };
                };

                //p.$getWidth = function () {
                //    var p = this.$UIComponent;
                //    var d = this.$DisplayObject;
                //    return p[9] != null ? p[9] : (d[3] != null ? d[3] : this.$getContentBounds().width);
                //}
                //
                //p.$getHeight = function () {
                //    var p = this.$UIComponent;
                //    var d = this.$DisplayObject;
                //    return p[10] != null ? p[10] : (d[4] != null ? d[4] : this.$getContentBounds().height);
                //}

                //uiHeight
                p.$setLeft = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[0] == val) {
                        return false;
                    }
                    p[0] = val;
                    this.$invalidateContentBounds();
                };

                p.$setRight = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[1] == val) {
                        return false;
                    }
                    p[1] = val;
                    this.$invalidateContentBounds();
                };

                p.$setHorizontalCenter = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[2] == val) {
                        return false;
                    }
                    p[2] = val;
                    this.$invalidateContentBounds();
                };

                p.$setTop = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[3] == val) {
                        return false;
                    }
                    p[3] = val;
                    this.$invalidateContentBounds();
                };

                p.$setBottom = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[4] == val) {
                        return false;
                    }
                    p[4] = val;
                    this.$invalidateContentBounds();
                };

                p.$setVerticalCenter = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[5] == val) {
                        return false;
                    }
                    p[5] = val;
                    this.$invalidateContentBounds();
                };

                p.$setPercentWidth = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[6] == val) {
                        return false;
                    }
                    p[6] = val;
                    this.$invalidateContentBounds();
                };

                p.$setPercentHeight = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[7] == val) {
                        return false;
                    }
                    p[7] = val;
                    this.$invalidateContentBounds();
                };

                p.$addFlags = function (flags) {
                    if (flags & 0x0001 == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                        this.__flags |= 0x1000;
                    }
                    this.__flags |= flags;
                };

                //p.$setUIWidth = function (val) {
                //    var p = this.$UIComponent;
                //    if (p[8] == val) {
                //        return;
                //    }
                //    p[8] = val;
                //    this.$invalidatePosition();
                //}
                //
                //p.$setUIHeight = function (val) {
                //    var p = this.$UIComponent;
                //    if (p[9] == val) {
                //        return;
                //    }
                //    p[9] = val;
                //    this.$invalidatePosition();
                //}

                /**
                 * 验证 UI 属性
                 */
                p.$validateUIComponent = function () {
                    this.$removeFlags(0x1000);
                    //开始验证属性
                    //console.log("验证 ui 属性");
                    var p = this.$UIComponent;
                    if (p[0] != null && p[1] == null && p[2] != null) {
                        this.width = (p[2] - p[0]) * 2;
                        this.x = p[0];
                    } else if (p[0] == null && p[1] != null && p[2] != null) {
                        this.width = (p[1] - p[2]) * 2;
                        this.x = 2 * p[2] - p[1];
                    } else if (p[0] != null && p[1] != null) {
                        this.width = this.parent.width - p[1] - p[0];
                        this.x = p[0];
                    } else {
                        if (p[0] != null) {
                            this.x = p[0];
                        }
                        if (p[1] != null) {
                            this.x = this.width - p[1] - this.width;
                        }
                        if (p[6]) {
                            this.width = this.parent.width * p[6] / 100;
                        }
                    }
                    if (p[3] != null && p[4] == null && p[5] != null) {
                        this.height = (p[5] - p[3]) * 2;
                        this.y = p[3];
                    } else if (p[3] == null && p[4] != null && p[5] != null) {
                        this.height = (p[4] - p[5]) * 2;
                        this.y = 2 * p[5] - p[4];
                    } else if (p[3] != null && p[4] != null) {
                        this.height = this.parent.height - p[4] - p[3];
                        this.y = p[3];
                    } else {
                        if (p[2] != null) {
                            this.y = p[0];
                        }
                        if (p[3] != null) {
                            this.y = this.height - p[1] - this.height;
                        }
                        if (p[7]) {
                            this.height = this.parent.height * p[7] / 100;
                        }
                    }
                    var children = this.__children;
                    if (children) {
                        var child;
                        for (var i = 0, len = children.length; i < len; i++) {
                            child = children[i];
                            if (child.__UIComponent) {
                                child.$validateUIComponent();
                            }
                        }
                    }
                };

                p.$onFrameEnd = function () {
                    if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                        this.$validateUIComponent();
                    }
                    $root._get(Object.getPrototypeOf(p), "$onFrameEnd", this).call(this);
                };

                Object.defineProperty(p, "left", {
                    get: function get() {
                        return this.$UIComponent[0];
                    },
                    set: function set(val) {
                        this.$setLeft(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "right", {
                    get: function get() {
                        return this.$UIComponent[1];
                    },
                    set: function set(val) {
                        this.$setRight(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "horizontalCenter", {
                    get: function get() {
                        return this.$UIComponent[2];
                    },
                    set: function set(val) {
                        this.$setHorizontalCenter(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "top", {
                    get: function get() {
                        return this.$UIComponent[3];
                    },
                    set: function set(val) {
                        this.$setTop(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "bottom", {
                    get: function get() {
                        return this.$UIComponent[4];
                    },
                    set: function set(val) {
                        this.$setBottom(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "verticalCenter", {
                    get: function get() {
                        return this.$UIComponent[5];
                    },
                    set: function set(val) {
                        this.$setVerticalCenter(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "percentWidth", {
                    get: function get() {
                        return this.$UIComponent[6];
                    },
                    set: function set(val) {
                        this.$setPercentWidth(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "percentHeight", {
                    get: function get() {
                        return this.$UIComponent[7];
                    },
                    set: function set(val) {
                        this.$setPercentHeight(val);
                    },
                    enumerable: true,
                    configurable: true
                });
            }
        }]);

        return UIComponent;
    }();
    //////////////////////////End File:extension/ui/core/UIComponent.js///////////////////////////

    //////////////////////////File:extension/ui/Group.js///////////////////////////


    var Group = function (_flower$Sprite) {
        _inherits(Group, _flower$Sprite);

        function Group() {
            _classCallCheck(this, Group);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Group).call(this));

            _this.$initUIComponent();
            return _this;
        }

        return Group;
    }(flower.Sprite);

    UIComponent.register(Group);
    Group.prototype.__UIComponent = true;
    black.Group = Group;
    //////////////////////////End File:extension/ui/Group.js///////////////////////////

    //////////////////////////File:extension/ui/DataGroup.js///////////////////////////

    var DataGroup = function (_black$Group) {
        _inherits(DataGroup, _black$Group);

        function DataGroup() {
            _classCallCheck(this, DataGroup);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(DataGroup).call(this));
        }

        return DataGroup;
    }(black.Group);

    black.DataGroup = DataGroup;
    //////////////////////////End File:extension/ui/DataGroup.js///////////////////////////

    //////////////////////////File:extension/ui/Image.js///////////////////////////

    var Image = function (_flower$Bitmap) {
        _inherits(Image, _flower$Bitmap);

        function Image() {
            var source = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            _classCallCheck(this, Image);

            var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Image).call(this));

            _this3.$initUIComponent();
            _this3.source = source;
            return _this3;
        }

        _createClass(Image, [{
            key: "$setSource",
            value: function $setSource(val) {
                if (this.__source == val) {
                    return;
                }
                this.__source = val;
                if (val == null) {
                    this.texture = null;
                } else if (val instanceof flower.Texture) {
                    this.texture = val;
                } else {
                    if (this.__loader) {
                        this.__loader.dispose();
                    }
                    this.__loader = new flower.URLLoader(val);
                    this.__loader.load();
                    this.__loader.addListener(flower.Event.COMPLETE, this.__onLoadComplete, this);
                    this.__loader.addListener(flower.IOErrorEvent.ERROR, this.__onLoadError, this);
                }
            }
        }, {
            key: "__onLoadError",
            value: function __onLoadError(e) {
                this.__loader = null;
            }
        }, {
            key: "__onLoadComplete",
            value: function __onLoadComplete(e) {
                this.__loader = null;
                this.texture = e.data;
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (this.__loader) {
                    this.__loader.dispose();
                }
                _get(Object.getPrototypeOf(Image.prototype), "dispose", this).call(this);
            }
        }, {
            key: "source",
            get: function get() {
                return this.__source;
            },
            set: function set(val) {
                this.$setSource(val);
            }
        }]);

        return Image;
    }(flower.Bitmap);

    UIComponent.register(Image);
    Image.prototype.__UIComponent = true;
    black.Image = Image;
    //////////////////////////End File:extension/ui/Image.js///////////////////////////
})();