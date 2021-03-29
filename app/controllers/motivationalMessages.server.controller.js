const mongoose = require('mongoose');
const MotivationalMessages = require('mongoose').model('MotivationalMessage');
const User = require('mongoose').model('User');

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
// Motivational Messages list, it gets all messages
//********************************************************************* */
exports.listMotivationalMessages = function (req, res) {
    MotivationalMessages.find()
        .populate('createdBy')
        .sort({ creationDate: -1 })
        .exec((err, motivationalMessages) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(motivationalMessages);
            }
        });
};




//********************************************************************* */
// 		Create motivational message 
//********************************************************************* */
exports.create = function (req, res, next) {

    var motivationalMessage = new MotivationalMessages(req.body);
    motivationalMessage.save(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(motivationalMessage);
        }
    });

};




