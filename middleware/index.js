var Campground = require('../models/campground');
var Comment = require('../models/comment');

// all the  middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(error, foundCampground) {
			if (error) {
				req.flash('error', 'Campground not found');
				res.redirect('back'); // back =  will return to previous page
			} else {
				// does user own campground?
				if (foundCampground.author.id.equals(req.user._id)) {
					// cannot use "===" operator because "foundCampground.author.id" is a Mongoose Object while "req.user._id" is a String
					next(); // next will be defined by the route (edit. update, delete)
				} else {
					req.flash('error', "You don't have permission to do that!");
					//if user is not the owner, redirect
					res.redirect('back');
				}
			}
		});
		// if not logged in, redirect
	} else {
		req.flash('error', 'You need to be logged in to do that!');
		res.redirect('back'); // user will return to previous page
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(error, foundComment) {
			if (error) {
				res.redirect('back'); // user will return to previous page
			} else {
				// does user own comment?
				if (foundComment.author.id.equals(req.user._id)) {
					// cannot use "===" operator because "foundCampground.author.id" is a Mongoose Object while "req.user._id" is a String
					next(); // next will be defined by the route (edit. update, delete)
				} else {
					req.flash('error', "You don't have permission to do that!");
					//if user is not the owner, redirect
					res.redirect('back');
				}
			}
		});
		// if not logged in, redirect
	} else {
		req.flash('error', 'You need to be logged in to do that!');
		res.redirect('back'); // user will return to previous page
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You need to be logged in to do that!');
	res.redirect('/login');
};
module.exports = middlewareObj;
