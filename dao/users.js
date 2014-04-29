/**
 * users dao - provides assess to user entity
 */

var fs = require('fs');
//global file is included here:
eval(fs.readFileSync(__dirname + '/../global.js') +'');

var bcrypt = require('bcrypt-nodejs');

function UsersDAO(db){

	
	/* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof UsersDAO)) {
        console.log('Warning: UsersDAO constructor called without "new" operator');
        return new UsersDAO(db);
    }
    
	var users = db.collection("users");
	
	/*
	 * addUser
	 * This function adds new user to the database
	 */
	this.addUser = function(username, password, email, callback)
	{
		// generate salt
		var salt = bcrypt.genSaltSync();
		var hash_pwd = bcrypt.hashSync(password, salt);
		var user = {username:username,password:hash_pwd};
		if (email){
			user.email = email;
		}
				
		users.insert(user, function(err, result){
			if (err) {
				callback(err, null);
			}
			else {
				console.log("user inserted");
				callback(null, result[0]);
			}
		});
	};
	

	/*
	 * validateLogin
	 * Validates the user login
	 */
	this.validateLogin =  function(username, password, callback){
		// check is user exist in the database
		// If user found, check if password matches
 
		users.findOne({'username':username}, function (err, user) {

		if (err) return callback(err, null);

     	if (user) {
         	if (bcrypt.compareSync(password, user.password)) {
             	callback(null, user);
         	}
         		else {
        	 		var wrong_password_error  = new Error(ERROR_WRONG_PASSWORD);
					wrong_password_error.code = ERROR_WRONG_PASSWORD;
					callback(wrong_password_error,null);
         		}
     		}
     		else {
     			var user_error  = new Error(ERROR_USER_NOT_FOUND);
				user_error.code = ERROR_USER_NOT_FOUND;
				callback(user_error,null);
     		}
		});		
 	};
}

module.exports.UsersDAO = UsersDAO;