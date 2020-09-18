var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware'); // no need to say "middleware/index.js" because it will automatically require this file based on having the name "index" and will assume it is the main file

//CAMPGROUNDS INDEX route - display all campgrounds
router.get('/', function(req, res) {
	//Get all campgrounds from DB
	Campground.find({}, function(error, allCampgrounds) {
		if (error) {
			console.log(error);
		} else {
			res.render('campgrounds/index', { campgrounds: allCampgrounds, page: 'campgrounds' });
		}
	});
});

// CAMPGROUNDS CREATE route - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
	// get data from form and add to campgrounds array
	var image = req.body.image;
	var price = req.body.price;
	var name = req.body.name;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = { name: name, price: price, image: image, description: desc, author: author };
	// campgrounds.push(newCampground); -  deleted because there is no local array defined anymore
	// Create a new campground and save to DB
	Campground.create(newCampground, function(error, newlyCreated) {
		if (error) {
			console.log(error);
		} else {
			//redirect back to campgrounds page
			res.redirect('/campgrounds');
		}
	});
});

// CAMPGROUNDS NEW route - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});

//CAMPGROUNDS SHOW route
// = show more info about one particular campgroud (ie. based on ID)
// IMPORTANT: add this route after the NEW route. Otherwise it will treat the word "new" as ":id"
router.get('/:id', function(req, res) {
	// find campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec(function(error, foundCampground) {
		if (error) {
			console.log(error);
		} else {
			// render show.ejs template with that campground
			res.render('campgrounds/show', { campground: foundCampground });
		}
	});
});

//CAMPGROUNDS EDIT route

router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(error, foundCampground) {
		res.render('campgrounds/edit', { campground: foundCampground }); // we need to pass in "campground" so we can use info like "id, name , desc" in edit.ejs template
	});
});

//CAMPGROUNDS UPDATE route

router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground) {
		if (error) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id); // we can also use "+ updatedCampground._id"
		}
	});
});

//CAMPGROUNDS DESTROY route

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res, next) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) return next(err);

		campground.remove();
		req.flash('success', 'Campground deleted successfully!'); // one time flash on the screen to let the user know the action was completed successfully.
		res.redirect('/campgrounds');
	});
});

module.exports = router;
