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

// Checks if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// GET route for changing password page
router.get('/changepass', isLoggedIn, function(req, res, next) {
    // Checks if user has social login IDs, if yes password changing is not allowed
    if (req.user.googleId || req.user.githubId || req.user.linkedinId) {
        req.flash('loginMessage', 'Password change is only available for local accounts. Please use your social login provider.');
        return res.redirect('/');
    }
    
    res.render('auth/changepass', {
        title: 'Change Password',
        message: req.flash('changePasswordMessage'),
        success: req.flash('changePasswordSuccess'),
        displayName: req.user ? req.user.displayName : ""
    });
});

// POST route for processing password change
router.post('/changepass', isLoggedIn, function(req, res, next) {
    // Checks if user has social login IDs, if yes, password change not allowed
    if (req.user.googleId || req.user.githubId || req.user.linkedinId) {
        req.flash('changePasswordMessage', 'Password change is only available for local accounts. Please use your social login provider.');
        return res.redirect('/changepass');
    }
    
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Makes sure all fields are filled
    if (!currentPassword || !newPassword || !confirmPassword) {
        req.flash('changePasswordMessage', 'All fields are required');
        return res.redirect('/changepass');
    }
    
    // Check if the new passwords match
    if (newPassword !== confirmPassword) {
        req.flash('changePasswordMessage', 'New passwords do not match');
        return res.redirect('/changepass');
    }

    // Checks if they're trying to use same password
    if (currentPassword === newPassword) {
        req.flash('changePasswordMessage', 'New password must be different from current password');
        return res.redirect('/changepass');
    }

    req.user.changePassword(currentPassword, newPassword, function(err) {
        if (err) {
            if (err.name === 'IncorrectPasswordError') {
                req.flash('changePasswordMessage', 'Current password is incorrect');
            } else {
                console.error('Password change error:', err);
                req.flash('changePasswordMessage', 'Error changing password');
            }
            return res.redirect('/changepass');
        }
        
        req.flash('changePasswordSuccess', 'Password changed successfullly!');
        res.redirect('/changepass');
    });
});


module.exports = router;
