const emergencyAlerts = require('../controllers/emergencyAlerts.server.controller');

module.exports = function (app) {

    app.route('/emergencyAlertsBypatient/:userId')
        .get(emergencyAlerts.emergencyAlertsBypatient);

    app.route('/registerEmergencyAlert')
        .post(emergencyAlerts.create);

    app.route('/emergencyAlertsList')
        .get(emergencyAlerts.emergencyAlertsList);

    app.route('/emergencyAlertById/:alertId')
        .get(emergencyAlerts.emergencyAlertById)

    app.route('/responseEmergencyAlert/:alertId')
        .put(emergencyAlerts.respondEmergencyAlert)

    
};
