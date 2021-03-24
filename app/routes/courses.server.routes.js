const courses = require('../controllers/courses.server.controller');

module.exports = function (app) {


    app.route('/createCourse')
        .post(courses.create);

    // Set up the 'courses' parameterized routes 
    app.route('/courses/:courseId')
        .get(courses.courseByID)
        .put(courses.update)
        .delete(courses.deleteById);;

    app.route('/courses')
        .get(courses.list);

    app.route('/coursesAvailablesByStudent/:studentId')
        .get(courses.coursesAvailablesByStudent);




};
