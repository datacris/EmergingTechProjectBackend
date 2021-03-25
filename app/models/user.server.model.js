// Load the module dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;
//
// Define a new 'StudentSchema'
var UserSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		// Validate the email format
		match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
	password: {
		type: String,
		required: true,
		// Validate the 'password' value length
		validate: [
			(password) => password && password.length > 2,
			'Password should be longer tha 2 characters'
		]
	},
	userType: String

});

// Set the 'fullname' virtual property
UserSchema.virtual('fullName').get(function () {
	return this.firstName + ' ' + this.lastName;
}).set(function (fullName) {
	const splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

// Use a pre-save middleware to hash the password
// before saving it into database
UserSchema.pre('save', function (next) {
	//hash the password before saving it
	this.password = bcrypt.hashSync(this.password, saltRounds);
	next();
});

// Create an instance method for authenticating user
UserSchema.methods.authenticate = function (password) {
	//compare the hashed password of the database 
	//with the hashed version of the password the user enters
	return this.password === bcrypt.hashSync(password, saltRounds);
};


// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'User' model out of the 'UserSchema'
mongoose.model('User', UserSchema);