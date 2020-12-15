var express = require("express");
var router = express.Router();
let UserModel = require("./users");
let passporLocal = require("passport-local");
let passport = require("passport");
let multer = require("multer");
let PostModel = require("./postModal");

passport.use(new passporLocal(UserModel.authenticate()));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    var date = new Date();
    var filekanaam = date.getTime() + file.originalname;
    cb(null, filekanaam);
  },
});
var upload = multer({ storage: storage });

router.post("/uploadpic", upload.single("prfl"), function (req, res) {
  let adressOfImage = "/images/uploads/" + req.file.filename;
  UserModel.findOne({ username: req.session.passport.user })
  .then(function ( picFound ) {
    picFound.prfl = adressOfImage;
    picFound.save().then(function () {
      res.redirect("/update");
    });
  });
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

/* GET login page. */
router.get("/login", sendToProfile, function (req, res, next) {
  res.render("login");
});

/* GET register page. */
router.get("/register", function (req, res, next) {
  res.render("register");
});




router.get('/newsfeed', isLoggedIn, function(req,res){
  PostModel.find().populate('user').exec( function(e, allPosts){
      console.log(allPosts);
      res.render('newsfeed', {allPosts})
    })
  })

/* GET register page. */


router.get('/profile',isLoggedIn, function(req, res, next) {
  UserModel.findOne({username : req.session.passport.user }).populate('posts')
  .exec(function(e, userDets){
   
    res.render('profile',{userDets});
  })

});

/* POST register page. */
router.post("/register", function (req, res) {
  let detailsWithoutPassword = {
    username: req.body.username,
    email: req.body.email,
  };
  UserModel.register(detailsWithoutPassword, req.body.password)
  .then(function (a) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});


/* GET UPDATE page. */
router.get('/update',isLoggedIn, function(req, res, next) {
  UserModel.findOne({username : req.session.passport.user })
  .then(function(Userfound){
    res.render('update',{Userfound} );
  })
  
});

router.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login");
  }
}

function sendToProfile(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/profile");
  } else {
    return next();
  }
}


router.post("/update", isLoggedIn, function (req, res) {
  var updation = {

    username: req.body.username,
    city: req.body.city,
    about: req.body.about
  };
  UserModel
    .findOneAndUpdate({ username: req.session.passport.user }, {$set : updation}, {
      new: true,
    })
    .then(function (updatedUser) {
      req.logIn(updatedUser, function (err) {
        res.redirect("/profile");
      });
    });
});

router.post("/post", isLoggedIn, function (req, res) {
  UserModel.findOne({ username: req.session.passport.user }).then(function (
    foundUser
  ) {
    PostModel.create({
      postText: req.body.post,
      user: foundUser,
    }).then(function (newCreatedPost) {
      foundUser.posts.push(newCreatedPost);
      foundUser.save().then(function () {
        res.redirect("/profile");
      });
    });
  });
});


router.post('/search', function (req, res) {
  UserModel.find({ username: new RegExp(req.body.username, 'i') })
    .then(function (users) {
      // res.send(users)
      res.render('searched', { users });
    })
});


router.get('/chat', function(req,res){
  UserModel.findOne({username : req.session.passport.user})
  .then(function(foundUser){
    res.render('chat', {foundUser})
  })
})


module.exports = router;
