config = require(__dirname+'/configuration/config');
var app = require('express')();
var http = require('http');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var fs = require('fs');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
 
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
 
    // Pass to next layer of middleware
    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.statusCode = 200;
        res.end();
    } else {
        //move on
        next();
    }
 });

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(__dirname+'/swaggerConfig/input.yaml', 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());
            // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(config.swaggerRouterOptions));

    // Start the server
    http.createServer(app).listen(config.serverPort, function() {
                console.log('Your server is listening on port %d (http://localhost:%d)', config.serverPort, config.serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', config.serverPort);
            });
});


module.exports = {
    app
};