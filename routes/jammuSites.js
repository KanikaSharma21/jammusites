var express = require('express');
var router = express.Router();
var JammuSite = require('../models/jammuSite');
var Comment = require('../models/comments');
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//index- show all sites
router.get("/",function(req,res){
	//get all sites from database
  JammuSite.find({},function(err,alljammuSites){
    if(err)
      console.log(err);
    else
res.render("jammusites/index",{jammuSites:alljammuSites});
  })
  
})

//=========================================================
//CREATE-add new site to database
//CREATE - add new site to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to sites array
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newSite = {name: name, image: image, description: desc,price:price, author:author, location: location, lat: lat, lng: lng};
    // Create a new site and save to DB
    JammuSite.create(newSite, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to sites page
            console.log(newlyCreated);
            res.redirect("/jammuSites");
        }
    });
  });
});
//NEW-show form to create new site
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("jammusites/new.ejs");
})

//===========================================================
//show-shows more info about one site

router.get("/:id",function(req,res)
{
  //find the site with provided id
  JammuSite.findById(req.params.id).populate("comments").exec(function(err,foundSite)

  {
     if(err)
      console.log(err);
    else{
      console.log(foundSite);
            //render show template with that site 
    res.render("jammusites/show",{jammusite:foundSite});
       }
  })
  
})


//EDIT SITE ROUTE
router.get("/:id/edit",middleware.checkSiteOwnership,function(req,res) 
{
  JammuSite.findById(req.params.id,function(err,foundSite){
    res.render("jammusites/edit",{jammusite:foundSite});
  })
  //if not redirect
 });


// UPDATE SITE ROUTE
router.put("/:id", middleware.checkSiteOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.jammusite.lat = data[0].latitude;
    req.body.jammusite.lng = data[0].longitude;
    req.body.jammusite.location = data[0].formattedAddress;

    JammuSite.findByIdAndUpdate(req.params.id, req.body.jammusite, function(err, jammusite){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/jammuSites/" + jammusite._id);
        }
    });
  });
});

//Destroy site route
router.delete("/:id",middleware.checkSiteOwnership,function(req,res){
 JammuSite.findByIdAndRemove(req.params.id,function(err,removed){
    if(err){
      res.redirect("/jammuSites");
    }else
    {
      res.redirect("/jammuSites");
    }
  })
})
module.exports = router;