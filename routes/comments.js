var express = require('express');
var router = express.Router({ mergeParams: true }); // add argument to solve the issue that req.params.id is not making it through to our comments route
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware'); // no need to say "middleware/index.js" because it will automatically require this file based on having the name "index" and will assume it is the main file

// COMMENTS NEW route

router.get('/new', middleware.isLoggedIn, function(req, res) {
	// find campground by id
	Campground.findById(req.params.id, function(error, campground) {
		if (error) {
			console.log(error);
		} else {
			res.render('comments/new', { campground: campground }); //pass-in campground variable and save it to {campground: ...} so we can have access to it in new.ejs template
		}
	});
});

// COMMENTS CREATE route

router.post('/', middleware.isLoggedIn, function(req, res) {
	//lookup campground using id
	Campground.findById(req.params.id, function(error, campground) {
		if (error) {
			req.flash('error', 'Something went wrong!');
			console.log(error);
			res.redirect('/campgrounds');
		} else {
			//create new comment
			Comment.create(req.body.comment, function(error, comment) {
				if (error) {
					console.log(error);
				} else {
					//add username and id to comment. there will always be an user because we have the "isLoggedIn" check added above
					comment.author.username = req.user.username;
					comment.author.id = req.user._id;
					//save comment
					comment.save();
					//connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Successfully added comment.');
					//redirect to campground show page
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});
// COMMENTS EDIT route

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
		}
	});
});

// COMMENTS UPDATE route

router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// COMMENTS DESTROY route

router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted.');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;
