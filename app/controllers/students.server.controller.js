// Load the module dependencies
const Student = require('mongoose').model('Student');
const Course = require('mongoose').model('Course');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;

//
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
// Creates new students
//********************************************************************* */
exports.create = function (req, res, next) {

	var newStudent = new Student(req.body); //get data from React form
	//console.log(" ************ Course body: " + req.body.courseName);
	newStudent.save(function (err) {
		if (err) {
			return next(err);
		} else {
			res.json(newStudent);

		}
	});
};

//********************************************************************* */
// 'studentByID' controller method to find a course by its id
//********************************************************************* */
exports.studentByID = function (req, res) {

	Student.findOne({
		_id: req.params.studentId
	}, (err, student) => {
		if (err) {
			console.log('error*******');
			console.log(err.message)
			return next(err.message);
		} else {
			// Set the 'req.user' property
			req.student = student;
			// Call the next middleware
			res.status(200).json(req.student);
		}
	});
};

//********************************************************************* */
// 'coursesByStudent' controller method to find a course by its id
//********************************************************************* */
exports.coursesByStudent = function (req, res) {

	Student.find({ _id: req.params.studentId }).populate('courseList').exec((err, student) => {
		if (err) {
			console.log('error*******');
			console.log(err.message)
			return next(err.message);
		} else {
			// Set the 'req.user' property
			req.student = student;
			// Call the next middleware
			console.log(student)
			res.status(200).json(student);
		}
	});
};

//********************************************************************* */
// 'dropCourse' controller method to drop a course 
//********************************************************************* */
exports.dropCourse = function (req, res) {

	Student.findOne({ studentNumber: req.body.student }, (err, student) => {

		if (err) {
			return getErrorMessage(err);
		} else {
			Course.findOne({ _id: req.body.course }, (err, course) => {
				if (err) {
					return getErrorMessage(err);
				}
				else {

					Course.findOneAndUpdate(
						{ _id: course._id },
						{ $pull: { studentsList: student._id } },
						{ multi: true },
						function (error, success) {
							if (error) {
								console.log(error.message)
								return getErrorMessage(err);
							} else {
								console.log(success);
							}
						});


					Student.findOneAndUpdate(
						{ _id: student._id },
						{ $pull: { courseList: course._id } },
						{ multi: true },
						function (error, success) {
							if (error) {
								console.log(error.message)
								return getErrorMessage(err);
							} else {
								console.log(success);
							}
						});
				}

				res.status(200).json(req.student);
			})
		}

	});
};


//********************************************************************* */
// 'enrollCourse' controller method to update a course 
//********************************************************************* */
exports.enrollCourse = function (req, res) {

	Student.findOne({ studentNumber: req.body.student }, (err, student) => {

		if (err) {
			return getErrorMessage(err);
		} else {
			Course.findOne({ _id: req.body.course }, (err, course) => {
				if (err) {
					return getErrorMessage(err);
				} else {

					Course.findOneAndUpdate(
						{ _id: course._id },
						{ $push: { studentsList: student } },
						function (error, success) {
							if (error) {
								console.log(error.message)
								return getErrorMessage(err);
							} else {
								console.log(success);
							}
						});

					Student.findOneAndUpdate(
						{ _id: student._id },
						{ $push: { courseList: course } },
						function (error, success) {
							if (error) {
								console.log(error.message)
								return getErrorMessage(err);
							} else {
								console.log(success);
							}
						});
				}

				res.status(200).json(req.student);
			})
		}

	});
};

//********************************************************************* */
// 'list' controller method to find students list
//********************************************************************* */
exports.list = function (req, res) {
	console.log('***********************************************10')
	Student.find({})
		.populate('courseList')
		.exec((err, students) => {
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				console.log('***********************************************1')
				console.log(students)
				res.status(200).json(students);
			}
		});
};

exports.signout = (req, res) => {
	res.clearCookie("token")
	return res.status('200').json({ message: "signed out" })
}

//
//'read' controller method to display a user
exports.read = function (req, res) {
	// Use the 'response' object to send a JSON response
	res.json(req.user);
};
//




// ********************************************************
//  Authenticates a student n
// ********************************************************
exports.authenticate = function (req, res, next) {
	// Get credentials from request
	console.log(req.body)
	const username = req.body.auth.username;
	const password = req.body.auth.password;
	console.log(password)
	console.log(username)
	//find the user with given username using static method findOne
	Student.findOne({ studentNumber: username }, (err, student) => {
		if (err) {
			return next(err);
		} else {
			console.log(student)
			//compare passwords	
			if (bcrypt.compareSync(password, student.password)) {
				// Create a new token with the user id in the payload
				// and which expires 300 seconds after issue
				const token = jwt.sign({ id: student._id, username: student.studentNumber }, jwtKey,
					{ algorithm: 'HS256', expiresIn: jwtExpirySeconds });
				console.log('token:', token)
				// set the cookie as the token string, with a similar max age as the token
				// here, the max age is in milliseconds
				res.cookie('token', token, { maxAge: jwtExpirySeconds * 10000, httpOnly: true });
				res.status(200).send({ screen: student.studentNumber });
				//
				//res.json({status:"success", message: "user found!!!", data:{user:
				//user, token:token}});

				req.student = student;
				//call the next middleware
				next()
			} else {
				res.json({
					status: "error", message: "Invalid username/password!!!",
					data: null
				});
			}

		}

	});
};
//
// protected page uses the JWT token
exports.welcome = (req, res) => {
	// We can obtain the session token from the requests cookies,
	// which come with every request
	const token = req.cookies.token
	console.log(token)
	// if the cookie is not set, return an unauthorized error
	if (!token) {
		return res.status(401).end()
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
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			return res.status(401).end()
		}
		// otherwise, return a bad request error
		return res.status(400).end()
	}

	// Finally, return the welcome message to the user, along with their
	// username given in the token
	// use back-quotes here
	res.send(`${payload.username}`)
};
//


// ********************************************************
//            check if the student is signed in
// ********************************************************
exports.isSignedIn = (req, res) => {
	// Obtain the session token from the requests cookies,
	// which come with every request
	const token = req.cookies.token
	console.log(token)
	// if the cookie is not set, return 'auth'
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
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			// the JWT is unauthorized, return a 401 error
			return res.status(401).end()
		}
		// otherwise, return a bad request error
		return res.status(400).end()
	}

	// Finally, token is ok, return the username given in the token
	res.status(200).send({ screen: payload.username, userId: payload.id });
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