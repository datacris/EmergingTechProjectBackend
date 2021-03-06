// Load the module dependencies
const User = require('mongoose').model('User');


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;


// Create a new error handling controller method
const getErrorMessage = function (err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (const errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};


//********************************************************************* */
// 		Creates new users
//********************************************************************* */
exports.create = function (req, res, next) {

	var newUser = new User(req.body); //get data from React form
	newUser.save(function (err) {
		if (err) {
			return next(err);
		} else {
			res.json(newUser);
			// res.status(200).json(newUser);
		}
	});
};


//********************************************************************* */
// List all patients
//********************************************************************* */
exports.listPatients = function (req, res) {

	User.find({ userType: 'patient' })
		.exec((err, patients) => {
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				console.log(patients)
				res.status(200).json(patients);
			}
		});
};

//********************************************************************* */
// 'userById' return the user by its Id
//********************************************************************* */
exports.userById = function (req, res) {

	User.findOne({
		_id: req.params.userId
	}, (err, user) => {
		if (err) {
			console.log(err.message)
			return next(err.message);
		} else {
			res.status(200).json(user);
		}
	});
};


exports.authenticate = function (req, res, next) {


	const userEmail = req.body.auth.email;
	const userPassword = req.body.auth.password;

	//find the user with given username using static method findOne
	User.findOne({ email: userEmail }, (err, user) => {
		if (err) {

			return next(err);
		} else {
			//compare passwords	
			if (bcrypt.compareSync(userPassword, user.password)) {
				// Create a new token with the user id in the payload
				// and which expires 300 seconds after issue
				const token = jwt.sign({
					userId: user._id,
					userEmail: user.email,
					userRole: user.userType
				}, jwtKey, {
					algorithm: 'HS256',
					expiresIn: jwtExpirySeconds
				});
				console.log('token:', token)
				// set the cookie as the token string, with a similar max age as the token
				// here, the max age is in milliseconds
				res.cookie('token', token, { 
						maxAge: jwtExpirySeconds * 10000, 
						httpOnly: true,
						// secure: process.env.NODE_ENV === 'production'? true: false
						// domain: process.env.NODE_ENV === 'production'? 'https://datacris-emerging-mern-project.herokuapp.com': 'http://localhost:5000'
					 });

				res.status(200).json({
					status: "success",
					message: "user found!!!",
					userId: user._id,
					userEmail: user.email,
					userRole: user.userType,
					data: {
						user: user,
						token: token
					}
				});

				req.user = user;
				//call the next middleware
				next()
			} else {
				res.json({
					status: "error",
					message: "Invalid username or password!",
					data: null
				});
			}

		}

	});
};

// ********************************************************
//  log out deleting the cokie
// ********************************************************
exports.signout = (req, res) => {
	res.clearCookie("token")
	return res.status('200').json({ message: "signed out" })
}

// ********************************************************
//            check if the user is signed in
// ********************************************************
exports.isSignedIn = (req, res) => {
	// Obtain the session token from the requests cookies,
	// which come with every request
	const token = req.cookies.token
	console.log(token)
	// if the cookie is not set, return 'auth'
	if (!token) {
		return res.send({ userEmail: '' }).end();
	}
	var payload;
	try {
		// Parse the JWT string and store the result in `payload`.
		// Note that we are passing the key in this method as well. This method will throw an error
		// if the token is invalid (if it has expired according to the expiry time we set on sign in),
		// or if the signature does not match
		payload = jwt.verify(token, jwtKey)
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			// the JWT is unauthorized, return a 401 error
			return res.status(401).end()
		}
		// otherwise, return a bad request error
		return res.status(400).end()
	}

	// Finally, token is ok, return the username given in the token
	res.status(200).send({
		userEmail: payload.userEmail,
		userId: payload.userId,
		userRole: payload.userRole
	});
}


//isAuthenticated() method to check whether a user is currently authenticated
exports.requiresLogin = function (req, res, next) {
	// Obtain the session token from the requests cookies,
	// which come with every request
	const token = req.cookies.token
	console.log(token)
	// if the cookie is not set, return an unauthorized error
	if (!token) {
		return res.send({ screen: 'auth' }).end();
	}
	var payload;
	try {
		// Parse the JWT string and store the result in `payload`.
		// Note that we are passing the key in this method as well. This method will throw an error
		// if the token is invalid (if it has expired according to the expiry time we set on sign in),
		// or if the signature does not match
		payload = jwt.verify(token, jwtKey)
		console.log('in requiresLogin - payload:', payload)
		req.id = payload.id;
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			return res.status(401).end()
		}
		// otherwise, return a bad request error
		return res.status(400).end()
	}
	// user is authenticated
	//call next function in line
	next();
};