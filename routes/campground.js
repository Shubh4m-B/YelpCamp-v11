var express 	= require("express");
var router 		= express.Router();
var Campground	= require("../models/campgrounds");
var Comment		= require("../models/comments");
var middleware	= require("../middleware");

//INDEX ROUTE
router.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allCamps){
		if(err){
			console.log("Something went wrong!");
			console.log(err);
		}
		else{	
			
			 res.render("campgrounds/index", {allCamps: allCamps});
		}
	})	
});

//CREATE ROUTE
router.post("/campgrounds",middleware.isLoggedIn, function(req,res){
	
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id : req.user._id,
		username : req.user.username
 	};
	var newCamp = {name: name, image: image, description: desc, author: author};
	Campground.create(newCamp, function(err,camp){
		if(err){
			req.flash("error", "Something went wrong!!");
			console.log("Something went wrong!");
		}
		else{
			req.flash("success", "Campground Added");
			res.redirect("/campgrounds");
		}
	})
});

//NEW ROUTE
router.get("/campgrounds/new",middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW ROUTE
router.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			req.flash("error", "Something went wrong!!");
			console.log("something went wrong!");
		}
		else{
			// console.log(foundCamp);
			res.render("campgrounds/show", {camp: foundCamp});
		}
	});
});

//EDIT ROUTE
router.get("/campgrounds/:id/edit", middleware.campgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		res.render("campgrounds/edit", {camp: foundCamp});
	});
});

//UPDATE ROUTE
router.put("/campgrounds/:id",middleware.campgroundOwnership, function(req,res){
	
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, newCamp){
		if(err){
			req.flash("error", "Something went wrong!!");
			console.log(err);
		}
		else{
			req.flash("success", "Campground Updated");
			res.redirect("/campgrounds/" + newCamp._id);
		}
	});
});

router.delete("/campgrounds/:id",middleware.campgroundOwnership, function(req, res){
	Campground.findByIdAndDelete(req.params.id, function(err,removedCamp){
		if(err){
			req.flash("error", "Something went wrong!!");
			console.log(err);
		}		
		Comment.deleteMany( {_id: { $in: removedCamp.comments } }, (err) => {
			if (err) {
				req.flash("error", "Something went wrong!!");
                console.log(err);
            }
			req.flash("success", "Campground Deleted")
            res.redirect("/campgrounds");
        });
	});
});

module.exports = router;