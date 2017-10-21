var redis = require("redis")
var subscriber = redis.createClient();

exports.use = function (io, db) {
    console.log('[INTERNAL] Listening for internal events...');
    subscriber.psubscribe('internal:*');
    subscriber.on('error', function (err) {
        console.log('[INTERNAL]' + err);
    });
    subscriber.on('psubscribe', function (pattern, count) {
        console.log('[INTERNAL] Subscribed to ' + pattern + '. Now subscribed to ' + count + ' channels.');
    });
    subscriber.on('pmessage', function (pattern, channel, message) {
        var payload = JSON.parse(message);
        console.log('[INTERNAL] Message on channel ' + channel + '. Message: ' + message + '.');

        if (channel === 'internal:temperature') {
            db.put('temperature', payload);
            io.emit('temperature', payload);
        }

        if (channel === 'internal:presence') {
            db.put('presence', payload);
            io.emit('presence', { movement: payload.movement });
        }

    });

}