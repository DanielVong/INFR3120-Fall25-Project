var express = require('express');
var router = express.Router();
const passport = require('passport');
let DB = require('../config/db');
let userModel = require('../models/user');
let User = userModel.User;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', displayName: req.user?req.user.displayName:"" });
});

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home', displayName: req.user?req.user.displayName:"" });
});
// Get method for login
router.get('/login', function(req,res,next){
  if(!req.user)
  {
    res.render('auth/login',
      {
      title:'Login',
      message: req.flash('loginMessage')
      }

    )
  }
  else
  {
    return res.redirect("/")
  }
});

// Post method for login
router.post('/login', function(req,res,next){
  passport.authenticate('local',(err,user,info)=>{
    if(err)
    {
      return next(err);
    }
    if(!user)
    {
      req.flash('loginMessage','AuthenticationError');
      return res.redirect('/login');
    }
    req.login(user,(err)=>{
    if(err)
    {
      return next(err);
    }
    return res.redirect("/movies")
    })
  })(req,res,next)
});
// Get method for register
router.get('/register', function(req,res,next){
  if(!req.user)
  {
    res.render('auth/register',
      {
      title:'Register',
      message: req.flash('registerMessage')
      }

    )
  }
  else
  {
    return res.redirect("/")
  }
});
// Post method for register
router.post('/register', function(req,res,next){
  let newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email:req.body.email,
    displayName: req.body.displayName
  })
  User.register(newUser, req.body.password, (err)=>{
    if(err)
    {
      console.log("Error:Inserting the new user");
      if(err.name=="UserExistingError")
      {
        req.flash('registerMessage','Registration Error:User already Exist');
      }
      return res.render('auth/register',
        {
          title:'Register',
          message:req.flash('registerMessage')
        }
      )
    }
    else{
      return passport.authenticate('local')(req,res,()=>{
        res.redirect("/movies");
      })
    }
  })
});
router.get('/logout',function(req,res,next){
req.logout(function(err)
{
  if(err)
  {
    return next(err)
  }
})
res.redirect("/");
})

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
router.get('/auth/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE'  }),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  });
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/',
  failureRedirect: '/login'
 }));
module.exports = router;
