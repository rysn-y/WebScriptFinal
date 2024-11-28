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

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'register' });
});

module.exports = router;
