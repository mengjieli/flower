class Config {
    static cmds = [];
    static clients = {};

    static addClient(name, client) {
        if (!Config.clients[name]) {
            Config.clients[name] = [];
        }
        Config.clients[name].push(client);
    }

    static removeClient(name, client) {
        var list = Config.clients[name];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i] == client) {
                    list.splice(i, 1);
                    break;
                }
            }
        }
    }

    static getClients(name) {
        return Config.clients[name] || [];
    }

    static getClient(id) {
        for (var key in Config.clients) {
            var list = Config.clients[key];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].id == id) {
                        return list[i];
                    }
                }
            }
        }
        return null;
    }
}