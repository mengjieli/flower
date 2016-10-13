"use strict";

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Main = function () {
    function Main() {
        _classCallCheck(this, Main);

        flower.start(this.ready.bind(this));
    }

    _createClass(Main, [{
        key: "ready",
        value: function ready() {

            var list = [
                {
                    "url": "res/images/map/castle/castle_ruins1.png",
                    "width": 2048,
                    "height": 2048,
                    "size": 16,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/map/castle/castle_ruins.png",
                    "width": 2048,
                    "height": 2048,
                    "size": 16,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/map/castle/castle.png",
                    "width": 2048,
                    "height": 2048,
                    "size": 16,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/map/castle/castlebuilding.png",
                    "width": 2048,
                    "height": 2048,
                    "size": 16,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/map/castle/castle1.png",
                    "width": 2048,
                    "height": 2048,
                    "size": 16,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_block_remove.png",
                    "width": 1024,
                    "height": 2048,
                    "size": 8,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/ui/public_plist.png",
                    "width": 1024,
                    "height": 1024,
                    "size": 4,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/ui/new_public_plist.png",
                    "width": 1024,
                    "height": 1024,
                    "size": 4,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/map/castle/castlebuilding2.png",
                    "width": 1024,
                    "height": 1024,
                    "size": 4,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/castle/castle_armytrain_light.png",
                    "width": 1024,
                    "height": 1024,
                    "size": 4,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_armytrain_getLight.png",
                    "width": 2048,
                    "height": 512,
                    "size": 4,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/button/tubiao.png",
                    "width": 512,
                    "height": 1024,
                    "size": 2,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/ui/mainResourcesModule/newres/main_menu_plist.png",
                    "width": 512,
                    "height": 1024,
                    "size": 2,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/ui/new_popup_plist.png",
                    "width": 512,
                    "height": 1024,
                    "size": 2,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/castle/castle_tree_fall.png",
                    "width": 512,
                    "height": 1024,
                    "size": 2,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/map/castle/castlecloud.png",
                    "width": 512,
                    "height": 1024,
                    "size": 2,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_waterfall_s.png",
                    "width": 512,
                    "height": 1024,
                    "size": 2,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_upgrade_hammer.png",
                    "width": 512,
                    "height": 1024,
                    "size": 2,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/guide/guide_handtouch.png",
                    "width": 512,
                    "height": 1024,
                    "size": 2,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_tree_shine.png",
                    "width": 512,
                    "height": 1024,
                    "size": 2,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_cave_light.png",
                    "width": 512,
                    "height": 1024,
                    "size": 2,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/ui/chatModule/newChat/new_chat_plist.png",
                    "width": 512,
                    "height": 1024,
                    "size": 2,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/ui/denglu_di.png",
                    "width": 960,
                    "height": 540,
                    "size": 1.97,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/ui/mainResourcesModule/main_menu_plist.png",
                    "width": 512,
                    "height": 719,
                    "size": 1.4,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/castle/castle_pray_shine.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_pray_people.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_armytrain_getOneLight.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_fountain_temle.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_upgrade_complete.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_ship_down.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_waterfall_s_wide.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_waterfall_l.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/map/castle/castlebg.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_tech_upgrade.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/map/castle/castlebuilding1.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_armytrain_star.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_ship_up.png",
                    "width": 512,
                    "height": 512,
                    "size": 1,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/button/hammer.png",
                    "width": 256,
                    "height": 512,
                    "size": 0.5,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/castle/castle_whitesmoke.png",
                    "width": 256,
                    "height": 512,
                    "size": 0.5,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_blacksmoke.png",
                    "width": 256,
                    "height": 512,
                    "size": 0.5,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_battle_hammer.png",
                    "width": 256,
                    "height": 512,
                    "size": 0.5,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/ui/chatModule/chat_plist.png",
                    "width": 512,
                    "height": 256,
                    "size": 0.5,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/ui/login/2_2.png",
                    "width": 960,
                    "height": 135,
                    "size": 0.49,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/battle/jiantou_open.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/battle/jiantou_close.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/castle/castle_fight_shine.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/netwaitingmodel/JuHua.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/castle/castle_wounded_shine.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_armytrain_icon.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant5_stand_leftdown.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant5_stand_rightup.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_carriage_rightup.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_windmill.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_fountain.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_immigrant_down.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_horseclock.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant5_move_rightup.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_carriage_leftdown.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant5_move_leftdown.png",
                    "width": 256,
                    "height": 256,
                    "size": 0.25,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/button/pay_icon.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/castle/castle_immigrant_up.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_immigrant.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_movegoods.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_royalguard_move_rightdown.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_royalguard_move_rightup.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_royalguard_stand.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant1_stand_rightup.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant4_move_rightup.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_out_train.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant3_move_rightup.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant2_stand_rightup.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant4_stand_rightup.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_royalguard_move_leftup.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_soldier_patrol_move_rightup.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_guard_move_down.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_guard_stand.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_guard_watch.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant3_stand_rightup.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_royalguard_move_leftdown.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_soldier_patrol_move_leftup.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_eagle.png",
                    "width": 128,
                    "height": 256,
                    "size": 0.12,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/ui/login/1_1.PNG",
                    "width": 207,
                    "height": 121,
                    "size": 0.09,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant3_stand_leftdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_snake_leftdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_snake_leftup.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_snake_rightup.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_fish.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant4_stand_leftdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant2_move_leftdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant2_stand_leftdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_guard_move_up.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_soldier_patrol_move_leftdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_snake_rightdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant4_move_leftdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant1_stand_leftdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant3_move_leftdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant1_move_leftdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_soldier_patrol_move_rightdown.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant2_move_rightup.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/images/animation/ui/castle/castle_merchant1_move_rightup.png",
                    "width": 128,
                    "height": 128,
                    "size": 0.06,
                    "creationTime": 12226,
                    "life": 2
                },
                {
                    "url": "res/loadingAndLogining/denglu_caise.png",
                    "width": 139,
                    "height": 68,
                    "size": 0.03,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/loadingAndLogining/denglu_heibai.png",
                    "width": 139,
                    "height": 68,
                    "size": 0.03,
                    "creationTime": 11172,
                    "life": 3
                },
                {
                    "url": "res/images/animation/ui/castle/castle_clock.png",
                    "width": 64,
                    "height": 128,
                    "size": 0.03,
                    "creationTime": 12226,
                    "life": 2
                }];
            flower.URLLoader.urlHead = "";
            var module = new flower.Module("modules/software/module.json");
            module.load();
            module.addListener(flower.Event.COMPLETE,function(){

                var ui = new flower.UIParser();
                ui.parseUIAsync("res/Test2.xml",{list:new flower.ArrayValue(list)});
                flower.Stage.getInstance().addChild(ui);
            });
            return;

            var preloading = new PreLoading();
            preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        }
    }, {
        key: "loadThemeComplete",
        value: function loadThemeComplete(e) {
            e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
            var stage = flower.Stage.getInstance();
            stage.backgroundColor = 0;

            var ui = new flower.UIParser();
            ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
            //ui.parseUIAsync("modules/dungeonEditor/Main.xml");
            stage.addChild(ui);
        }
    }]);

    return Main;
}();