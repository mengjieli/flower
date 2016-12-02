var os = require("os");

var System = {}

System.WINDOWS = "windows";
System.MACOS = "mac os";


var os = require('os');
var IPv4, hostName;
hostName = os.hostname();
var network = os.networkInterfaces();
var netKey;
for(var key in network) {
    if(key.slice(0,"en".length) == "en") {
        netKey = key;
    }
}
try {
    for (var i = 0; i < os.networkInterfaces()[netKey].length; i++) {
        if (os.networkInterfaces()[netKey][i].family == 'IPv4') {
            IPv4 = os.networkInterfaces()[netKey][i].address;
        }
    }
} catch(e) {

}
System.platform = os.platform().slice(0, 3) == "win" ? System.WINDOWS : System.MACOS;
System.hostName = hostName;
System.IP = IPv4;

global.System = System;