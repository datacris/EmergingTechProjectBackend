const emergencyAlerts = require('../controllers/emergencyAlerts.server.controller');

module.exports = function (app) {


    // app.route('/vitalSignsBypatient/:userId')
    //     .get(vitalSigns.vitalSignsBypatient);

    app.route('/registerEmergencyAlert')
        .post(emergencyAlerts.create);

        

};
