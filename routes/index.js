var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/create-survey', function(req, res, next) {
  res.render('create-survey', { title: 'Create Survey' });
});

module.exports = router;
