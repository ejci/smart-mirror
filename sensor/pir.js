var Gpio = require('onoff').Gpio;
var redis = require("redis").createClient();
var config = require(__dirname + '/pir.json');

var pir = new Gpio(config.pin, 'in', 'both');
var timeout = config.timeout * 1000;
var timer;
var isMovement = false;

//something is moving
var movementDetected = function () {
    if (!isMovement) {
        //console.log('movement detected...');
        redis.publish(config.event, JSON.stringify({
            movement: true
        }));
    }
    isMovement = true;
    return;
}

//something is moving
var movementStoped = function () {
    if (isMovement) {
        //console.log('movement stopped...');
        redis.publish(config.event, JSON.stringify({
            movement: false
        }));
    }
    isMovement = false;
    return;
}

//watch value
pir.watch(function (err, value) {
    if (!err) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(movementStoped, timeout);
        movementDetected();
    }
});


//After init output
console.log(config.description);
console.log('GPIO pin           : ' + config.pin);
console.log('Timeout            : ' + Math.round(config.timeout / 60, 0) + 'm ' + config.timeout % 60 + 's');
console.log('Endpoint           : ' + config.endpoint);
console.log('Event              : ' + config.event);
