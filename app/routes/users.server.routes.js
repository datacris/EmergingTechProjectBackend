var users = require('../controllers/users.server.controller');
var express = require('express');
var router = express.Router();
// Define the routes module' method
module.exports = function (app) {

    app.route('/createUser')
        .post(users.create);

    app.post('/signIn', users.authenticate);

    app.get('/read_cookie', users.isSignedIn);
    app.get('/signOut', users.signout);

    app.route('/patients')
        .get(users.listPatients);

    app.route('/user/:userId')
        .get(users.userById);


};

