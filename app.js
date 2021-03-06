var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	// Requiring models
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds');

// Requiring routes
var campgroundRoutes = require('./routes/campgrounds'),
	commentsRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index');

// Requiring dotenv package
require('dotenv').config();
var db = process.env.MONGODB_URL;

var url = process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp_v12'; //as a good practice, define the variable with a backup in case the env. var. breaks
// both MONGODB_URL and DATABASEURL are defined in Heroku as Config Vars

// connect to local yelp_camp database (yelp_camp_v12) or mongoDB Atlas database (yelp_camp_deployed) via process.env.DATABASEURL
mongoose
	.connect(url, {
		// connect only to mongoDB Atlas database (yelp_camp_deployed) via process.env.MONGODB_URL
		// mongoose.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to DB yey!'))
	.catch((error) => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.set('view engine', 'ejs'); // to avoid adding .ejs extension when specifing a template name
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// seedDB(); // commmented out to avoid rewriting the DB if not needed
// populate the DB with default data everytime the server is restarted. The code is saved in file "seeds.js"

app.locals.moment = require('moment');
// make Moment JS available to display time since post was created
// Moment is available for use in all view files via the variable named "moment"

// ====== PASSPORT CONFIGURATION ==========

app.use(
	require('express-session')({
		secret: 'Once again Rusty wins cutest dog!',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

// tells our app to use the 3 route files that we required above
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
	console.log('The YelpCamp Server has started!');
});
