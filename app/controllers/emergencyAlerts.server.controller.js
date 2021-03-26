const mongoose = require('mongoose');
const EmergencyAlert = require('mongoose').model('EmergencyAlert')

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
// Vital signs by patient Id
//********************************************************************* */
// exports.vitalSignsBypatient = function (req, res) {
//     VitalSign.find({ patient: req.params.userId })
//         .populate('createdBy')
//         .exec((err, vitalSigns) => {
//             if (err) {
//                 return res.status(400).send({
//                     message: getErrorMessage(err)
//                 });
//             } else {
//                 res.status(200).json(vitalSigns);
//             }
//         });
// };


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