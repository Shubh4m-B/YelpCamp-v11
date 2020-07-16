var mongoose	= require("mongoose");
var Campground 	= require("../models/campgrounds");
var Comment		= require("../models/comments");

//middleware goes here
var middlewareObj = {};

middlewareObj.campgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCamp){
			if(err){
				req.flash("error", "Something went wrong!!");
				res.redirect("/campgrounds");
			}
			else{
				if(foundCamp.author.id.equals(req.user._id)){
					next();
					// res.render("campgrounds/edit", {camp: foundCamp});
				}
				else{
					req.flash("warning", "Permission denied");
					res.redirect("back");
				}	
			}
		});
	}
	else{
		// req.flash("warning", "Permission denied");
		res.redirect("back");
	}
} 

middlewareObj.commentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundCom){
			if(err){
				res.redirect("/campgrounds");
			}
			else{
				if(foundCom.author.id.equals(req.user._id)){
					next();
					// res.render("campgrounds/edit", {camp: foundCamp});
				}
				else{
					res.redirect("back");
				}	
			}
		});
	}
	else{
		req.flash("warning", "Permission denied");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in First");
	res.redirect("/login");
} 
module.exports = middlewareObj;