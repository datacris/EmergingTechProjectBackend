const mongoose = require('mongoose');
const Course = require('mongoose').model('Course')
const Student = require('mongoose').model('Student')

//
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};

//********************************************************************* */
// Creates new courses in the main menu
//********************************************************************* */
exports.create = function (req, res, next) {

    var newCourse = new Course(req.body); //get data from React form
    //newCourse.studentsList = [null];
    newCourse.save(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(newCourse);

        }
    });
};

//********************************************************************* */
// 'courseByID' controller method to find a course by its id
//********************************************************************* */
exports.courseByID = function (req, res) {

    //console.log('id ', req.params.courseId)

    Course.findOne({
        _id: req.params.courseId
    }, (err, course) => {
        if (err) {
            console.log('error*******');
            return next(err);
        } else {
            // Set the 'req.user' property
            req.course = course;
            // Call the next middleware
            res.status(200).json(req.course);
        }
    });
};

//********************************************************************* */
// 'list' controller method to find a course by its id
//********************************************************************* */
exports.list = function (req, res) {

    Course.find({})
        .populate('studentsList')
        .exec((err, courses) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(courses);
            }
        });
};



//********************************************************************* */
// 'Delete' controller method to delete a course by its id
//********************************************************************* */
exports.deleteById = function (req, res) {

    Course.findOne({
        _id: req.params.courseId
    }, (err, course) => {
        if (err) {
            console.log('error*******');
            return next(err);
        } else {
            // Call the next middleware
            course.remove((err) => {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                    res.status(200).json(course);
                }
            });
        }
    });
};

//********************************************************************* */
// 'Update' controller method to update a course 
//********************************************************************* */
exports.update = function (req, res, next) {
    console.log(req.body);
    Course.findByIdAndUpdate(req.body._id, req.body, function (err, course) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(course);
    });
};

//********************************************************************* */
// 'coursesAvailablesByStudent' controller method to find a course by its id
//********************************************************************* */
exports.coursesAvailablesByStudent = function (req, res) {
    console.log('COURSE BY STUDENTS METHOD ********************')
    console.log(req.params.studentId)

    const studentId = req.params.studentId;

    Course.find({})
        // .select('studentsList')
        .populate('studentsList')
        .exec((err, courses) => {
            if (err) {
                console.log('error*******');
                console.log(err.message)
                return next(err.message);
            } else {
                console.log(courses)

                //let avaiableCourses = courses.find(course => course.studentsList === 'string 1');
                let avaiableCourses = [];
                for (let i = 0; i < courses.length; i++) {

                    let cont = 0;
                    if (courses[i].studentsList.length >0) {
                        for (let k = 0; k < courses[i].studentsList.length; k++) {
                            if (courses[i].studentsList[k]._id == studentId) {
                                cont++;
                            }
                            if (k == (courses[i].studentsList.length) - 1) {
                                if (cont == 0) {
                                    avaiableCourses.push(courses[i]);
                                }
                                cont = 0;
                            }
                        }
                    }else{
                        avaiableCourses.push(courses[i]);
                    }
                }
                console.log('Available courses  *************')
                console.log(avaiableCourses)
                res.status(200).json(avaiableCourses);
                // 
            }
        });
};

exports.read = function (req, res) {

    res.status(200).json(req.course);
};




//The hasAuthorization() middleware uses the req.article and req.user objects
//to verify that the current user is the creator of the current article
exports.hasAuthorization = function (req, res, next) {
    console.log('in hasAuthorization - creator: ', req.article.creator)
    console.log('in hasAuthorization - user: ', req.id)
    //console.log('in hasAuthorization - user: ',req.user._id)


    if (req.article.creator.id !== req.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
