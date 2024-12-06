var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Item = require('../models/item');


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
router.get('/edit', async (req, res) => {
  const { id } = req.query; // Extract the ID from the query string

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid Reminder ID');
  }

  try {
      const reminder = await Item.findById(id); // Fetch reminder from database
      if (!reminder) {
          return res.status(404).send('Reminder not found'); // Handle missing reminder
      }

      res.render('edit', { title: 'Edit Reminder', reminder }); // Pass reminder to the template
  } catch (error) {
      console.error('Error fetching reminder:', error);
      res.status(500).send('Error fetching reminder details.');
  }
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
