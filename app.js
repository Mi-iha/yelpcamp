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

mongoose
	// connect to yelp_camp database
	.connect('mongodb://localhost:27017/yelp_camp_v12', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to DB!'))
	.catch((error) => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.set('view engine', 'ejs'); // to avoid adding .ejs extension when specifing a template name
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// seedDB(); // commmented out to avoid rewriting the DB if not needed
// populate the DB with default data everytime the server is restarted. The code is saved in file "seeds.js"

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

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('The YelpCamp Server has started!');
});
