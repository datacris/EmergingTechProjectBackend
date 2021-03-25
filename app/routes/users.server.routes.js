var users = require('../controllers/users.server.controller');
var express = require('express');
var router = express.Router();
// Define the routes module' method
module.exports = function (app) {

    app.route('/createUser')
        .post(users.create);

    app.post('/signIn', users.authenticate);

    // app.route('/createStudent')
    //     .post(students.create);

    // app.route('/students')
    //     .get(students.list);

    // // Set up the 'courses' parameterized routes 
    // app.route('/students/:studentId')
    //     .get(students.studentByID);

    // app.get('/read_cookie', students.isSignedIn);
    // app.post('/signin', students.authenticate);

    // app.route('/enrollCourse')
    //     .put(students.requiresLogin, students.enrollCourse)

    // app.route('/dropCourse')
    //     .put(students.requiresLogin, students.dropCourse)

    // app.route('/coursesByStudent/:studentId')
    //     .get(students.coursesByStudent);

    // app.get('/signout', students.signout);

};

