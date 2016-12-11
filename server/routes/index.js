var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var config = res.config;
  res.render('index', { version: config.version });
});

module.exports = router;
