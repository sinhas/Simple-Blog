/**
 * SessionDao - provides assess to session entity
 */

function SessionDAO(db){

	
	/* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof SessionDAO)) {
        console.log('Warning: SessionDAO constructor called without "new" operator');
        return new SessionDAO(db);
    }
    
	var sessions = db.collection("sessions");
	var crypto = require('crypto');
	
	/*
	 * createSession
	 * This function adds new session to the database
	 */
	this.createSession = function(username, callback)
	{
		var current_date = (new Date()).valueOf().toString();
		var sessionID = Math.random().toString();
		crypto.createHash('sha1').update(current_date + sessionID).digest('hex');
				
		sessions.insert({"username": username , "_id": sessionID}, function(err, session){
			if (err) {
				callback(err, null);
			}
			else {
				console.log("session created" + session[0]._id);
				callback(null, sessionID);
			}
		});
	};
	
	/*
	 * endSession
	 * This function removes user session from database
	 */
	this.endSession = function(username, callback){
		sessions.remove({"username": username}, function(err,result){
			if (err) return callback(err,null);
			else
				{
					return callback(null,result);
				}
		});;
	};
	
	/*
	 * getUsername
	 * get the username for a given session
	 */
	this.getUsername = function(sessionID,callback){
		sessions.findOne({"_id":sessionID},function(err,result){
			if (err) {
				return callback(err,null);
			}
			else {
				if (result){
				
					return callback(null,result.username);
				}
			}
		});
	};
	
}



module.exports.SessionDAO = SessionDAO;