'use strict';

exports.handler = (event, context, callback) => {
    console.log('event', JSON.stringify(event, null, 2))

    /*
     * Expand S3 request to have index.html if it ends in /
     */
    const request = event.Records[0].cf.request;
    console.log('request', JSON.stringify(request, null, 2))

    if ((request.uri !== "/") /* Not the root object, which redirects properly */
        && (request.uri.endsWith("/") /* Folder with slash */ || (request.uri.lastIndexOf(".") < request.uri.lastIndexOf("/")) /* Most likely a folder, it has no extension (heuristic) */)) {
        if (request.uri.endsWith("/")) {
            request.uri = request.uri.concat("index.html");
        }
        else {
            const redirectUrl = request.uri.concat("/");
            const response = {
                status: '302',
                statusDescription: 'Found',
                headers: {
                    location: [{
                        key: 'Location',
                        value: redirectUrl,
                    }],
                }
            };
            return callback(null, response);
        }
    }
    callback(null, request);
};