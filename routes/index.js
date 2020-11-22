var express = require('express');
var router = express.Router();
let UserModel = require('./users');
let passporLocal = require('passport-local');
let passport = require('passport');


passport.use(new passporLocal(UserModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


/* GET login page. */
router.get('/login',sendToProfile ,function(req, res, next) {
  res.render('login');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

/* GET register page. */
router.get('/newsfeed',isLoggedIn ,function(req, res, next) {
  res.render('newsfeed');
});

/* GET register page. */
router.get('/profile',isLoggedIn ,function(req, res, next) {
  res.render('profile');
});

/* POST register page. */
router.post('/register', function(req, res) {
 let detailsWithoutPassword = {
   username : req.body.username,
   email : req.body.email,
 }
 UserModel.register(detailsWithoutPassword, req.body.password)
 .then(function(a){
   passport.authenticate('local')(req,res,function(){
     res.redirect('/profile')
   })
 })
});

router.get('/logout', function(req,res){
  req.logOut();
  res.redirect('/')
})

router.post('/login',passport.authenticate('local',{
  successRedirect : '/profile',
  failureRedirect : '/login'
}),function(req,res){})

function isLoggedIn(req,res,next){
if(req.isAuthenticated()){
  return next();
}
else{
  return res.redirect('/login')
}
}

function sendToProfile(req,res,next){
if(req.isAuthenticated()){
  res.redirect('/profile')
}
else{
  return next();
}
}

module.exports = router;
