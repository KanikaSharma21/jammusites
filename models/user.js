var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-Local-Mongoose')
var UserSchema = new mongoose.Schema({
	username: String,
	password: String

});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);