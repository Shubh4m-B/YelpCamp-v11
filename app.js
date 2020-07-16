var express 			= require("express"),
	app 				= express(),
	bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	passport			= require("passport"),
	LocalStrategy		= require("passport-local"),
	passLocalMongoose	= require("passport-local-mongoose"),
	Campground 			= require("./models/campgrounds"),
	Comment				= require("./models/comments"),
	methodOverride		= require("method-override"),
	User 				= require("./models/users"),
	flash				= require("connect-flash"),
	seedDB				= require("./seeds");

var campgroundRoutes	= require("./routes/campground"),
	commentRoutes		= require("./routes/comment"),
	indexRoutes			= require("./routes/index");
	
mongoose.connect("mongodb://localhost/yelp_camp_v8", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
// seedDB();

app.use(require("express-session")({
	secret: "hello, I am great",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.warning = req.flash("warning");
	res.locals.success = req.flash("success");
	next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("The YelpCamp App has started");
});