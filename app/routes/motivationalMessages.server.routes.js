const motivationalMessages = require('../controllers/motivationalMessages.server.controller');

module.exports = function (app) {

    app.route('/motivationalMessages')
        .get(motivationalMessages.listMotivationalMessages);

    app.route('/createMotivationalMessage')
        .post(motivationalMessages.create);

};
