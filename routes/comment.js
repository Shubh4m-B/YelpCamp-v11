var express 	= require("express");
var router 		= express.Router();
var Campground	= require("../models/campgrounds");
var Comment		= require("../models/comments");
var middleware	= require("../middleware");

//NEW Comment ROUTE
router.get("/campgrounds/:id/comments/new" ,middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			req.flash("error", "Something went wrong!!");
			console.log(err);
		}
		else{
			res.render("comments/new", {camp: foundCamp});
		}
	});	
});

//CREATE comment ROUTE
router.post("/campgrounds/:id/comments" ,middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, camp){
		if(err){
			req.flash("error", "Something went wrong!!");
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment,function(err, comment){
				if(err){
					req.flash("error", "Something went wrong!!");
					console.log(err);
				}
				else{
					//add username and id
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comments
					comment.save();
					camp.comments.push(comment);
					camp.save();
					// console.log(comment);
					req.flash("success", "Comment added");
					res.redirect("/campgrounds/" + camp._id);
				}
			});
		}
	});
});

//EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.commentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundCom){
		if(err){
			req.flash("error", "Something went wrong!!");
			console.log(err);
		}
		else{
			res.render("comments/edit", {camp_id: req.params.id, comment: foundCom});	
		}
	});
});

//UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id",middleware.commentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
		if(err){
			req.flash("error", "Something went wrong!!");
			console.log(err);
		}
		else{
			req.flash("success", "Comment updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.commentOwnership, function(req,res){
	Comment.findByIdAndDelete(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "Something went wrong!!");
			console.log(err);
		}
		else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;
