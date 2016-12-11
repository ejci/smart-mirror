var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;

router.post('/temperature', function (req, res, next) {
    var config = res.config;
    var db = res.db;
    var io = res.io;
    //console.log('/temperature', req.body);
    if (req.body && (req.body.temperature || req.body.humidity)) {
        db.put('temperature', req.body);
    }
    res.send('ok');
});

router.post('/presence', function (req, res, next) {
    var config = res.config;
    var db = res.db;
    var io = res.io;
    //console.log('/presence', req.body);
    if (req.body) {
        db.put('presence', req.body);
        io.emit('presence', { movement: req.body.movement });
    }
    res.send('ok');
});

router.get('/airplay/start', function (req, res, next) {
    var config = res.config;
    var db = res.db;
    var io = res.io;
    io.emit('airplay', { command: 'start' });
    res.send({
        status: 'ok'
    });
});

router.get('/airplay/stop', function (req, res, next) {
    var config = res.config;
    var db = res.db;
    var io = res.io;
    io.emit('airplay', { command: 'stop' });
    res.send({
        status: 'ok'
    });
});

router.post('/airplay/meta', function (req, res, next) {
    var config = res.config;
    var db = res.db;
    var io = res.io;
    io.emit('airplay', { meta: req.body });
    //console.log(req.body);
    res.send({
        status: 'ok'
    });
});

router.get('/knock/:count', function (req, res, next) {
    var config = res.config;
    var db = res.db;
    var io = res.io;
    var count = req.params.count;
    if (count) {
        io.emit('knock', { count: count });
    }
    // 1x knock : toggle display (on/off) 
    if (count == 1) {
        io.emit('display', { command: 'toggle' });
    }
    // 2x knock : toggle audio (mute/unmute)
    if (count == 2) {
        exec('amixer set PCM toggle');
    }

    /*--------------------------------------------------------*/
    // 6x knock : force refresh window
    if (count == 6) {
        io.emit('display', { command: 'refresh' });
    }

    // 8x knock : show service menu
    if (count == 8) {
        io.emit('display', { command: 'service' });
    }

    // 10x knock : reboot the whole thing
    if (count == 10) {
        exec('sudo reboot');
    }
    res.send('ok');
});


module.exports = router;

