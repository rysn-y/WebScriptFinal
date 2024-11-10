var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET create page. */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'create' });
});

/* GET remidner page. */
router.get('/reminders', function(req, res, next) {
  res.render('reminders', { title: 'reminders' });
});

/* GET edit page. */
router.get('/edit', function(req, res, next) {
  res.render('edit', { title: 'edit' });
});

module.exports = router;
