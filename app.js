
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var routes = require('./routes');
var path = require('path');
var mongoClient = require('mongodb').MongoClient;


// instantiate express and assign app variable to it.
var app = express();

mongoClient.connect('mongodb://localhost:27017/swetaBlog', function(err,db) {

	// set up all environments
	app.set('port', process.env.PORT || 3000);

	app.set('view engine', 'jade');
	app.set('views', path.join(__dirname,'views')); // add "views" to the path name for view calling
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());

	
	
	app.locals.sprintf = require('sprintf').sprintf;
	app.locals.format = "%1.0f";
	
	
    // Express middleware to populate 'req.cookies' so we can access cookies
    app.use(express.cookieParser());

    // Express middleware to populate 'req.body' so we can access POST variables
    app.use(express.bodyParser());

	// application routes. By default express looks in routes/index.js file for routing
	routes(app,db);
	
	 //Now router comes first and will be executed before static middleware
	// this will ensure app.use codes are called everytime
	app.use(express.static(path.join(__dirname, 'public')));
	
	http.createServer(app).listen(app.get('port'), function() {
		console.log('express server listening on port ' + app.get('port'));
	});	

});
