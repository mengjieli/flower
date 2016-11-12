var crypto = require('crypto');

function md5Binary(content) {
    return crypto.createHash('md5').update(content,"binary").digest('hex');
}

function md5(content) {
    return crypto.createHash('md5').update(content).digest('hex');
}

global.md5Binary = md5Binary;
global.md5 = md5;