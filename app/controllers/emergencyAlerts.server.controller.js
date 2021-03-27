const mongoose = require('mongoose');
const EmergencyAlert = require('mongoose').model('EmergencyAlert');
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
// Emergency alerts by patient Id
//********************************************************************* */
exports.emergencyAlertsBypatient = function (req, res) {
    EmergencyAlert.find({ createdBy: req.params.userId })
        .populate('createdBy')
        .populate('answeredBy')
        .sort({creationDate: -1})
        .exec((err, emergencyAlerts) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(emergencyAlerts);
            }
        });
};


//********************************************************************* */
// Emergency alert list gets all alerts
//********************************************************************* */
exports.emergencyAlertsList = function (req, res) {
    EmergencyAlert.find()
        .populate('createdBy')
        .populate('answeredBy')
        .sort({creationDate: -1})
        .exec((err, emergencyAlerts) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(emergencyAlerts);
            }
        });
};



//********************************************************************* */
// 		Create emergency alert
//********************************************************************* */
exports.create = function (req, res, next) {

    var emergencyAlert = new EmergencyAlert(req.body);
    emergencyAlert.save(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(emergencyAlert);
        }
    });
};

//********************************************************************* */
// 'emergencyAlert' gets emercency alert by its Id
//********************************************************************* */
exports.emergencyAlertById = function (req, res) {

    EmergencyAlert.findOne({ _id: req.params.alertId })
        .populate('createdBy')
        .populate('answeredBy')
        .exec((err, emergencyAlert) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(emergencyAlert);
            }
        });
};


//***************************************** */
//Updates the emergency alert with the nurse response
//*************************************** */
exports.respondEmergencyAlert = function (req, res) {

    //Find the nurse by its Id
    User.findOne({
		_id: req.body.answeredBy
	}, (err, nurse) => {
		if (err) {
			console.log(err.message)
			return next(err.message);
		} else {

            EmergencyAlert.findOne({
                _id: req.params.alertId
            }, (err, emergencyAlert) => {
                if (err) {
                    return next(err);
                } else {
                    emergencyAlert.medicalResponse = req.body.medicalResponse;
                    emergencyAlert.answeredBy = nurse;
                    emergencyAlert.answerDate = Date.now();
                    emergencyAlert.alertState = 'responded';

                    emergencyAlert.save(function (err) {
                        if (err) {
                            return next(err);
                        } else {
                            res.json(emergencyAlert);
                
                        }
                    });
                }
            });
		}
	});

    
};

