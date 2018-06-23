

module.exports = {
    init: init
};

function init(originalApp, info, callback) {
    try {
        console.log("UnRegistering the route info: ", info);
        var organization = info.organization_id;
        var project_name = info.project_name;
        var api_name = info.api_name;
        var revision_name = info.revision_name;
        var found = false;
        Object.keys(require.cache).forEach(function(key) {
            if(key.indexOf(organization)>-1 && key.indexOf(project_name)>-1 && (api_name==null || key.indexOf(api_name)>-1) && (revision_name==null || key.indexOf(revision_name)>-1) ) {
                delete require.cache[key];
            }
        });

        var swaggerTools = require('swagger-tools');
        var jsyaml = require('js-yaml');
        var fs = require('fs');
        var app = require('express')();
        config = require('./configuration/config');

        for(let i=0;i<originalApp._router.stack.length;i++){
            let regExp = originalApp._router.stack[i].regexp.toString();
            if(regExp.indexOf(organization)>-1 && regExp.indexOf(project_name)>-1 && (api_name==null || regExp.indexOf(api_name)>-1) && (revision_name==null || regExp.indexOf(revision_name)>-1) ) {
                originalApp._router.stack.splice(i,3);
                console.log("Found!");
                found= true;
                break;
            }
        }

        // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
        var spec = fs.readFileSync(__dirname + '/swaggerConfig/input.yaml', 'utf8');
        var swaggerDoc = jsyaml.safeLoad(spec);

        // Initialize the Swagger middleware
        swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
            try {
                var apiurl = info.apiPath;

                // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
                app.use(middleware.swaggerMetadata());

                // Validate Swagger requests
                //app.use(middleware.swaggerValidator());

                // Route validated requests to appropriate controller
                app.use(middleware.swaggerRouter(config.swaggerRouterOptions));

                // Serve the Swagger documents and Swagger UI
                originalApp.use(apiurl, middleware.swaggerUi());
                // Serve the Swagger documents and Swagger UI
                originalApp.use(apiurl, middleware.swaggerValidator());
                originalApp.use(app);
                callback(null, true);
            } catch (error) {
                console.log("Error inside: ", error);
                callback(error, false);
            }
        });
    } catch (error) {
        console.log("Throwing error: ", error);
        callback(error, false);
    }
}