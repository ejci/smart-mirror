var express = require('express');
var router = express.Router();

var request = require('request');

var levelup = require('levelup');
//var db = levelup('./mirrordb', { valueEncoding: 'json' });

var info = require('simple-node-info');

router.get('/status', function (req, res, next) {
  res.send({
    status: 'ok',
    server: info.getStat()
  });
});

router.get('/weather', function (req, res, next) {
  var db = res.db;
  var config = res.config;
  const apiKey = config.weather.apiKey;
  const city = config.weather.city;
  const expiration = config.weather.expiration * 1000;
  var time = new Date().getTime();
  var url = 'http://api.openweathermap.org/data/2.5/weather?units=metric&q=' + city + '&appid=' + apiKey

  db.get(url, function (err, value) {
    if (err) {
      //console.log('not existing, error');
      geData();
    } else if (value.timestamp + expiration < time) {
      //console.log('expired');
      geData();
    }
    else {
      //console.log('not expired', value.timestamp, expiration, time, value.timestamp + expiration - time);
      res.send(value.body);
    }
  });

  var geData = function () {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
        db.put(url, { timestamp: time, body: body });
      } else {
        res.status(500);
        res.send();
      }
    })
  }
});

router.get('/news', function (req, res, next) {
  var db = res.db;
  var config = res.config;
  const apiKey = config.news.apiKey;
  const source = config.news.source;
  const expiration = config.news.expiration * 1000;
  var time = new Date().getTime();
  var url = 'https://newsapi.org/v1/articles?source=' + source + '&sortBy=top&apiKey=' + apiKey;

  db.get(url, function (err, value) {
    if (err) {
      //console.log('not existing, error');
      geData();
    } else if (value.timestamp + expiration < time) {
      //console.log('expired');
      geData();
    }
    else {
      //console.log('not expired', value.timestamp, expiration, time, value.timestamp + expiration - time);
      res.send(value.body);
    }
  });

  var geData = function () {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
        db.put(url, { timestamp: time, body: body });
      } else {
        res.status(500);
        res.send();
      }
    })
  }

});
router.get('/quote', function (req, res, next) {
  var db = res.db;
  var config = res.config;
  const expiration = config.quote.expiration * 1000;
  var time = new Date().getTime();
  var url = 'http://quotes.rest/qod.json';

  db.get(url, function (err, value) {
    if (err) {
      //console.log('not existing, error');
      geData();
    } else if (value.timestamp + expiration < time) {
      //console.log('expired');
      geData();
    }
    else {
      //console.log('not expired', value.timestamp, expiration, time, value.timestamp + expiration - time);
      res.send(value.body);
    }
  });

  var geData = function () {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
        db.put(url, { timestamp: time, body: body });
      } else {
        res.status(500);
        res.send();
      }
    })
  }
});

router.get('/finance', function (req, res, next) {

});

router.get('/agenda', function (req, res, next) {

});

router.get('/music', function (req, res, next) {

});

router.get('/room/temperature', function (req, res, next) {
  var db = res.db;
  var config = res.config;
  db.get('temperature', function (err, value) {
    res.send(value);
  });
});

router.get('/room/presence', function (req, res, next) {
  var db = res.db;
  var config = res.config;
  db.get('presence', function (err, value) {
    res.send(value);
  });
});


module.exports = router;
