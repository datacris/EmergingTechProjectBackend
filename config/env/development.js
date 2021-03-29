//Development configuration options
//To sign the session identifier, use a secret string
module.exports = {
    // db: 'mongodb://localhost/emergingProject',
    db: 'mongodb+srv://datacris:lukwG5j6umKb9HnM@cluster0.a7dl2.mongodb.net/emergingTechProjectDb?retryWrites=true&w=majority',
    sessionSecret: 'developmentSessionSecret',
    secretKey: 'real_secret'
    
};
