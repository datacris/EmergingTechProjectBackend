const vitalSigns = require('../controllers/vitalSigns.server.controller');

module.exports = function (app) {


    app.route('/vitalSignsBypatient/:userId')
        .get(vitalSigns.vitalSignsBypatient);

    app.route('/registerVitalSigns')
        .post(vitalSigns.create);

    

};
