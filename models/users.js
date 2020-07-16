var mongoose 			= require("mongoose"),
	passLocalMongoose 	= require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username : String,
	password : String
});

userSchema.plugin(passLocalMongoose);

module.exports = mongoose.model("user", userSchema);