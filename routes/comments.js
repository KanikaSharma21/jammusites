var express = require('express');
var router = express.Router();
var JammuSite = require('../models/jammuSite');
var Comment = require('../models/comments');
var middleware = require("../middleware");

//=======================================================
//COMMENTS ROUTES
//=======================================================
//comments new
router.get("/jammuSites/:id/comments/new",middleware.isLoggedIn,function(req,res){
  //find sites by id
JammuSite.findById(req.params.id,function(err,jammusite){
    if(err)
      console.log(err);
    else

  res.render("comments/new",{jammuSite:jammusite});

  }) 

});

//comments  create

router.post("/jammuSites/:id/comments",middleware.isLoggedIn,function(req,res)
{   //lookup site by id
  JammuSite.findById(req.params.id,function(err,jammusite)
  {
    if(err)
      console.log(err);
    else 
      Comment.create(req.body.comment,function(err,comment)
      {
        if (err) {
          req.flash("error","something went wrong");
          console.log(err);
        }
        else
          {
            //add username and id to comments
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            
            //save comment
            comment.save();
          //associate sites to post
          jammusite.comments.push(comment);
        
           jammusite.save();
           console.log(comment);
           req.flash("success","successfully added comment");
          res.redirect("/jammuSites/" + jammusite._id);
            }
      });
  })
})

//comments edit route
router.get("/jammuSites/:id/comments/:comment_id/edit",middleware.checkSiteOwnership,function(req,res)
{    Comment.findById(req.params.comment_id,function(err,foundComment){
  if(err)
    res.redirect("back");
  else
  {
    res.render("comments/edit",{jammuSite_id:req.params.id,comment:foundComment});
  }
})
    
});

//comment update
router.put("/jammuSites/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
    if(err){
      res.redirect("back");
    }
    else{
      res.redirect("/jammuSites/" + req.params.id);
    }s
  })
})

//comment destroy route
router.delete("/jammuSites/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
  //findby id and remove
  Comment.findByIdAndRemove(req.params.comment_id,function(err,removedId){
    if(err)
      res.redirect("back");
    else{
      req.flash("success","comment deleted");
      res.redirect("/jammuSites/" + req.params.id);
    }
  })
})




module.exports = router;