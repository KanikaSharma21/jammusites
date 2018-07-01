var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require("../middleware");
var JammuSite = require('../models/jammuSite');
var Comment = require('../models/comments');
//=======================================================
//home route
router.get("/",function(req,res){
	res.render("home");
})




//======================
//AUTH ROUTES
//======================

//show register form
router.get("/register",function(req,res){
  res.render("register");
});

//handle sign up logic
router.post("/register",function(req,res){
  var newUser = new User({username: req.body.username});
  User.register(newUser,req.body.password,function(err,user){
    if(err){
     console.log(err);
      req.flash("error",err.message);
    return res.render("register");
  }
    passport.authenticate("local")(req,res,function(){
      req.flash("success","welcome to city of temples"  + user.username);
      res.redirect("/jammuSites");
    })
  })

  });

//Show login form
router.get("/login",function(req,res){
  res.render("login");
});

// handling login logic
router.post("/login",passport.authenticate("local",
  {
    successRedirect: "/jammuSites",
    failureRedirect: "/login"
  }),
  function(req,res){
  
});

//logout route
router.get("/logout",function(req,res){
  req.logout();
  req.flash("success","logged you out");
  res.redirect("/jammuSites");
});
module.exports = router;
