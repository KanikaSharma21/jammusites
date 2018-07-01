require('dotenv').config()

var   express       = require('express'),
      app           =express(),
      bodyParser    =require("body-parser"),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      flash         = require('connect-flash'),
      LocalStrategy = require('passport-local'),
      methodOverride= require('method-override'),
      JammuSite    = require("./models/jammuSite"),
     
      Comment       = require('./models/comments'),
      User          = require('./models/user');

//requiring routes
 var commentRoutes    = require("./routes/comments"),
     JammuSiteRoutes = require("./routes/jammuSites"),
     indexRoutes       = require("./routes/index");


//===========================================================

mongoose.connect("mongodb://localhost/JammuSite_fina");     
  app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//=========================================================

//PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: "Jammu-My City",
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error    = req.flash("error");
  res.locals.success     = req.flash("success");
  next();
})

app.use(indexRoutes);
app.use(commentRoutes);
app.use("/jammuSites",JammuSiteRoutes);

app.listen(3000,function(req,res){
	console.log('server started');
})