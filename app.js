const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const createError = require('http-errors');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config();
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Define Item Schema and Model
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// Passport Configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'No user with that username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect password' });
    }
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes
// Render Login Page
app.get('/login', (req, res) => {
  res.render('login');
});

// Render Register Page
app.get('/register', (req, res) => {
  res.render('register');
});

// Render Dashboard (Protected)
app.get('/dash', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('/index', { user: req.user });
  } else {
    res.redirect('/login');
  }
});

// Handle Login
app.post('/login', passport.authenticate('local', {
  successRedirect: '/index',
  failureRedirect: '/login',
  failureFlash: false,
}));

// Registration Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(400).send('Error registering user: ' + err.message);
  }
});

// Logout Route
app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send('Logout failed');
    res.redirect('/login');
  });
});

// Protected Route
app.get('/index', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`/index, ${req.user.username}`);
  } else {
    res.redirect('/login');
  }
});

// Item Creation Route
app.post('/create', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newItem = new Item({ name, description });
    await newItem.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while saving the data.");
  }
});

// Import and Use Routes
const indexRouter = require('./routes/index'); // Placeholder for index routes
const usersRouter = require('./routes/users'); // Placeholder for user routes

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;