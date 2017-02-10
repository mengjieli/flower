var sys = {};
flower.addStartBack(function () {
    for (var key in flower.sys) {
        sys[key] = flower.sys[key];
    }
})