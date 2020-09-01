var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

UserSchema.plugin(passportLocalMongoose);
// takes the "passport-local-mongoose" package that we requiered above
//and will add a bunch of methods that come with this package to our UserSchema
// it comes with important functionalities and features that we need to use for authentication

module.exports = mongoose.model('User', UserSchema);
