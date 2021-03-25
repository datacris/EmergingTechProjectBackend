//Development configuration options
//To sign the session identifier, use a secret string
module.exports = {
    db: 'mongodb://localhost/emergingProject',
    // db: 'mongodb+srv://datacris:ohbPLaLIpAX1sNPB@cluster0.a7dl2.mongodb.net/emergingTechProjectDb?retryWrites=true&w=majority',
    sessionSecret: 'developmentSessionSecret',
    secretKey: 'real_secret'
    
};
