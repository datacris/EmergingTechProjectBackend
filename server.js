// The server.js file is the main file of your Node.js application 
// It will load the express.js file as a module to bootstrap your Express application
//
//The process.env.NODE_ENV variable is set to the default 'development‘
//value if itdoesn 't exist.
// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load the module dependencies
var mongoose = require('./config/mongoose'),
    express = require('./config/express');

//Swagger for backend API documentation
    const swaggerJsDoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');

// Create a new Mongoose connection instance
var db = mongoose();
// Create a new Express application instance
var app = express();
// Use the Express application instance to listen to the '3000' port
const port = process.env.PORT || 5000

const swaggerOptions = {
    swaggerDefinition:{
        info: {
            title: 'App title',
            version: '1.0.0'
        }
    },
    apis: ['./app/controllers/users.server.controller.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port);
// Use the module.exports property to expose our Express application instance for external usage
module.exports = app; //returns the application object
// Log the server status to the console
console.log('Server running at port' + port);
