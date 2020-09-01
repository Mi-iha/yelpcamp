var mongoose = require('mongoose');
var Comment = require('./comment');

// Create Schema (patern) for DB record
var campgroundSchema = new mongoose.Schema({
	name: 'String',
	price: 'String', // even if user will provide a number, storing the price as a string allows us to preserve the formatting
	image: 'String',
	description: 'String',
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

// pre-hook that will be invoked before a ".remove" gets run
// because we do not have access to campgrounds, instead of "campground.comments" we will use "this.comments"
campgroundSchema.pre('remove', async function(next) {
	try {
		// we are trying this; Comment.deleteOne is returning a promise, we are waiting for the promise to be resolved and then we go to next() which will continue to remove the campgrounds
		await Comment.remove({
			_id: {
				$in: this.comments // $in = includes operator ;
			}
		});
		next();
	} catch (err) {
		// if above is not working, we are catching the error
		next(err);
	}
});
// Make a model that use campgroundSchema and has a bunch of methods on it that we can use
module.exports = mongoose.model('Campground', campgroundSchema);
