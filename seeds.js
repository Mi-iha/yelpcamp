var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

// var data = [
// 	{
// 		name: "Cloud's Rest",
// 		image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
// 		description:
// 			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
// 	},
// 	{
// 		name: 'Desert Mesa',
// 		image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
// 		description:
// 			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
// 	},
// 	{
// 		name: 'Canyon Floor',
// 		image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
// 		description:
// 			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
// 	}
// ];

// function seedDB() {
// 	//Remove all campgrounds from DB
// 	Campground.deleteMany({}, function(err) {
// 		if (err) {
// 			console.log(err);
// 		}
// 		console.log('removed campgrounds!');
// 		//Remove all comments from DB
// 		Comment.deleteMany({}, function(err) {
// 			if (err) {
// 				console.log(err);
// 			}
// 			console.log('removed comments!');
// 			//Add a few campgrounds
// 			data.forEach(function(seed) {
// 				Campground.create(seed, function(err, campground) {
// 					if (err) {
// 						console.log(err);
// 					} else {
// 						console.log('added a campground');
// 						//Create a comment
// 						Comment.create(
// 							{
// 								text: 'This place is great, but I wish there was internet',
// 								author: 'Homer'
// 							},
// 							function(err, comment) {
// 								if (err) {
// 									console.log(err);
// 								} else {
// 									campground.comments.push(comment);
// 									campground.save();
// 									console.log('Created new comment');
// 								}
// 							}
// 						);
// 					}
// 				});
// 			});
// 		});
// 	});
// }
// module.exports = seedDB;

// ====================== Refactor Callbacks with Async + Await ============================

var seeds = [
	{
		name: "Cloud's Rest",
		image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
		author: {
			id: '5f3be46ba05d1216fc4fa5c0',
			username: 'televizor'
		}
	},
	{
		name: 'Desert Mesa',
		image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
		author: {
			id: '5f3be4e877e267109cf3220a',
			username: 'teeevee'
		}
	},
	{
		name: 'Canyon Floor',
		image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',

		author: {
			id: '5f3be6501e520401a85246f1',
			username: 'ptest1'
		}
	}
];

async function seedDB() {
	await Campground.deleteMany({});
	console.log('Campgrounds removed!');
	await Comment.deleteMany({});
	console.log('Comments removed!');

	for (const seed of seeds) {
		let campground = await Campground.create(seed);
		console.log('Campground created');
		let comment = await Comment.create({
			text: 'This place is great, but I wish there was internet',
			author: {
				id: '5f3c00715f156c0e08d97e8e',
				username: 'test-eur'
			}
		});
		console.log('Comment created');
		campground.comments.push(comment);
		campground.save();
		console.log('Comment added to campground');
	}
}

module.exports = seedDB;
