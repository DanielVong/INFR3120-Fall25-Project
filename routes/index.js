var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/movie', function(req, res, next) {
  res.render('movie', { title: 'Create Movie' });
});

module.exports = router;
