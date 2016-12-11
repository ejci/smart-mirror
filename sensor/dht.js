var exec = require('child_process').exec;
var request = require('request');
var config = require(__dirname + '/dht.json');
var cmd = __dirname + '/' + config.script + ' ' + config.type + ' ' + config.pin + '';
var store = [];
var cummulative = config.cummulative;
var temperature = false;
var humidity = false;
var run = function () {
  exec(cmd, function (error, stdout, stderr) {
    if (!error) {
      var data = JSON.parse(stdout);
      //console.log(data); 
      store = store.splice(0, cummulative - 1);
      store.push(data);
      //console.log(store);
      var t = 0;
      var h = 0;
      for (var i = 0; i < store.length; i++) {
        t = t + store[i].temperature;
        h = h + store[i].humidity;
      }
      temperature = Math.round(t / store.length, 2);
      humidity = Math.round(h / store.length, 2);

      if (store.length === cummulative) {
        // POST process data to endpoint and ignore any errors
        request({
          url: config.endpoint,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          json: {
            temperature: temperature,
            humidity: humidity
          }
        }, function (err, res, body) {
          //dont care
        });
        //console.log('sending...', temperature, humidity);
      }
    } else {
      //console.error(stderr);
    }
  });
}

//refresh every X seconds
setInterval(run, config.refresh * 1000);
//After init output
console.log('DHT sensor reader...')
console.log('DHT type           : ' + config.type);
console.log('GPIO pin           : ' + config.pin);
console.log('script             : ' + __dirname + '/' + config.script);
console.log('Refresh interval   : ' + Math.round(config.refresh / 60, 0) + 'm ' + config.refresh % 60 + 's');
console.log('Command            : ' + cmd);
console.log('Endpoint           : ' + config.endpoint);



