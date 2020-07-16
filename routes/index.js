var express 	= require("express");
var router 		= express.Router();
var passport	= require("passport");
var User		= require("../models/users")

//ROOT ROUTE
router.get("/", function(req,res){
	res.render("landing");
});

//===========
//AUTH ROUTES
//===========

//REGISTER ROUTES
//REGISTER FORM
router.get("/register", function(req, res){
	res.render("register");
});

//handling user REGISTER 
router.post("/register", function(req,res){
	User.register(new User({username: req.body.username}), req.body.password, function(err,user){
		if(err){
			req.flash("error","Oops Try again (Try using a different username)");
			console.log(err);			
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success","Successfully signed in, Hello " + req.user.username);
			res.redirect("/campgrounds")
		})
	});
});

//LOGIN ROUTES
//LOGIN FORM
router.get("/login", function(req, res){
	res.render("login");
});

//handling user LOGIN
router.post("/login", passport.authenticate("local",{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req,res){
});

//LOGOUT ROUTES
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Successfully logged you out")
	res.redirect("/campgrounds");
});

module.exports = router;