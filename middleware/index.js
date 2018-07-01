var JammuSite = require("../models/jammuSite");
var Comment = require("../models/comments");

var middlewareObj = {};

middlewareObj.checkSiteOwnership=function(req,res,next)
{
//is user logged in ?
     if(req.isAuthenticated())
     {
      JammuSite.findById(req.params.id,function(err,foundSite)
      {
        if(err)
            {
              req.flash("error","sites not find")
              res.redirect("back")
             }
        else
           { //does user own the site?
                   if(foundSite.author.id.equals(req.user._id))
                     {
                      next();
                     }
                   else
                    {
                      req.flash("error","you don't have permission");
                       res.redirect("back");
                     }
       
           }
       })
    }
      else
      {
        req.flash("error","you need to be logged in");
     res.redirect("back");
  }
}

//===========================================
middlewareObj.checkCommentOwnership=function (req,res,next)
{
//is user logged in ?
     if(req.isAuthenticated())
     {
      Comment.findById(req.params.comment_id,function(err,foundComment)
      {
        if(err)
            {
              res.redirect("back")
             }
        else
           { //does user own the comment?
                   if(foundComment.author.id.equals(req.user._id))
                     {
                      next();
                     }
                   else
                    {
                      req.flash("error","you don't have ownership to do this");
                       res.redirect("back");
                     }
       
           }
       })
    }
      else
      {
        req.flash("error","you need to be logged in");
     res.redirect("back");
  }
}

//middleware
middlewareObj.isLoggedIn=function(req,res,next)
{
  if(req.isAuthenticated())
    return next();
    else{
      req.flash("error","you need to be logged in");
      res.redirect("/login");
    }
}
module.exports = middlewareObj;