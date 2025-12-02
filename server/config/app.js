var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
//Added connections from DB
let mongoose = require('mongoose');
let DB = require('./db');
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');
let cors = require('cors')
var app = express();
let userModel = require('../models/user');
let User = userModel.User;

//Test DB Connection
mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console,'Connection error'));
mongoDB.once('open',()=>{
  console.log('Connected to the MongoDB');
})
// Set-up Express Session
app.use(session({
  secret:"Somesecret",
  saveUninitialized:false,
  resave:false
}))
// initialize flash
app.use(flash());
// user authentication
passport.use(User.createStrategy());
// serialize and deserialize the user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// initialize the passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          username: profile.emails?.[0]?.value || `google_${profile.id}`
        });
      }
      
      return cb(null, user);
    } catch (err) {
      return cb(err, null);
    }
  }
));

// GitHub OAuth Strategy
var GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // Check if user already exists
      let user = await User.findOne({ githubId: profile.id });
      
      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          githubId: profile.id,
          displayName: profile.displayName || profile.username,
          email: profile.emails?.[0]?.value || '',
          username: profile.username || `github_${profile.id}`
        });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_KEY,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: process.env.LINKEDIN_CALLBACK,
  scope: ['r_emailaddress', 'r_liteprofile'],
}, function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    // To keep the example simple, the user's LinkedIn profile is returned to
    // represent the logged-in user. In a typical application, you would want
    // to associate the LinkedIn account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });
}));
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');

let moviesRouter = require('../routes/movie');
// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//Use moviesRouter variable
app.use('/movies',moviesRouter);
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
