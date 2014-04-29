/* 
 * function SessionHandler must be constucted using db
 */

var fs = require('fs');
//global file is included here:
eval(fs.readFileSync(__dirname + '/../global.js') +'');

var UsersDAO = require('../dao/users').UsersDAO;
var SessionDAO = require('../dao/session').SessionDAO;

function SessionHandler (db){
	"use strict";
	var users = new UsersDAO(db);
	var sessions = new SessionDAO(db);
	
	// check if user is alreday logged into middleware
	this.isUserLogged = function(req,res,next){
		var session_id = req.cookies.session;
		sessions.getUsername(session_id, function(err,username){
			if (!err && username)
				{
					req.username = username;
				}
		});
		 return next();
	}
	
	
	 /*
     * Display Signup   form
     */
	this.displaySignupPage =  function(req, res, next) {
	        res.render("signup", {username:"", password:"",
	                                    password_error:"",
	                                    email:""});
	 };
	 
     /*
      * handle  signup
      */
	 this.handleSignup = function(req, res, next) {
		 
		 var email = req.body.email;
		 var username = req.body.username;
		 var password = req.body.password;
		 users.addUser(username, password, email, function(err, user) {
			 			if (err) throw err; 
			 			else {
			 				sessions.createSession(username, function(err,sessionID){
			 					if(!err) {
			 						// add the sessionID to cookie
			 						 res.cookie('session', sessionID);
			 						return res.redirect('/');
			 					}
			 				});
			 			}
			 			});
	 }

	 /*
	  * login form
	  */
	 this.displayLoginPage = function (req, res, next){
		 	res.render("login", {username:"", 
			 					 password:""}
		 );
	 }
	 
	 /*
	  * handleLogin
	  */
	 this.handleLogin = function(req, res, next){
		 
		users.validateLogin(req.body.username, req.body.password, function(err, username) {
			 				if (err)
			 				{
			 					if (err.code == ERROR_WRONG_PASSWORD)
			 						return res.render("login", {username:req.body.username, password:"",login_error:ERROR_WRONG_PASSWORD});
			 					else if (err.code == ERROR_USER_NOT_FOUND)
			 						return res.render("login", {username:req.body.username, password:"",login_error:ERROR_USER_NOT_FOUND});
			 					else
			 						return next(err);
			 				} 
			 				else {
			 					sessions.createSession(req.body.username, function(err,sessionID){
				 					if(!err) {
				 						// add the sessionID to cookie
				 						 res.cookie('session', sessionID);
				 						return res.redirect('/');
				 					}
				 				});
			 				}
		 });
		 
	};
	
	/*
	 * displayLogoutPage
	 */
	 this.displayLogoutPage = function (req, res, next){
		 //delete session first
		 sessions.endSession(req.username, function(err){
			 if (err) throw err;
			 else {
				 res.cookie('session', '');
				 res.redirect('/');
			 }
		 });
	 }
	
	 
}

module.exports = SessionHandler;