const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
const DB = require('./db');
mongoose.connect(DB.URI);
const mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console,'Connection Error'));
mongoDB.once('open',()=>{
  console.log("Connected with the MongoDB");
});
mongoose.connect(DB.URI,{useNewURIParser:true,useUnifiedTopology:true}) 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect('mongodb+srv://obadaljabberi:obad1234@cluster0.mgss7.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

const reminderSchema = new mongoose.Schema({
  title: {type: String,required: true},
  description: string,
  date: Date,
  time: time,
  category: string
});

const Reminder = mongoose.model('Reminder', reminderSchema);
//   name: String,
//   description: String
// });

// const Item = mongoose.model('Item', ItemSchema);

app.post('/create', async (req, res) => {
  const { name, description } = req.body;

  try {
     const newItem = new Item({ name, description });
     await newItem.save();
     res.redirect('/');
   } catch (error) {
     console.error(error);
     res.status(500).send("An error occured while saving the data.");
   }
 });

app.post('/create', (req, res) => {
  const { name, description } = req.body;
  res.redirect('/');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
