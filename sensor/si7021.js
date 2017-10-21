var exec = require('child_process').exec;
var request = require('request');
var redis = require("redis").createClient();
var config = require(__dirname + '/si7021.json');
var cmd = __dirname + '/' + config.script + '';
var temperature = false;
var humidity = false;
var run = function () {
  exec(cmd, function (error, stdout, stderr) {
    if (!error) {
      var data = JSON.parse(stdout);
      //console.log(data); 
      temperature = Math.round(data.temperature, 2);
      humidity = Math.round(data.humidity, 2);

      redis.publish(config.event, JSON.stringify({
        temperature: temperature,
        humidity: humidity
      }));

      //console.log('sending...', temperature, humidity);
    } else {
      console.error(stderr);
    }
  });
}

//refresh every X seconds
run();
setInterval(run, config.refresh * 1000);
//After init output
console.log('SI7021 sensor reader...')
console.log('script             : ' + __dirname + '/' + config.script);
console.log('Refresh interval   : ' + Math.round(config.refresh / 60, 0) + 'm ' + config.refresh % 60 + 's');
console.log('Command            : ' + cmd);
console.log('Event              : ' + config.event);


