/**
 * posts dao - provides assess to posts entity
 */

function PostsDAO(db){

	
	/* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof PostsDAO)) {
        console.log('Warning: ContentDAO constructor called without "new" operator');
        return new PostsDAO(db);
    }
    
	var posts = db.collection("posts");
	
	/*
	 * getPosts
	 * This function get limited number of posts as specified by the parameter "num"
	 */
	this.getPosts= function(num, callback){
		posts.find().sort('date',-1).limit(num).toArray(function(err,items){
			if (err) return callback(err, null);
			else{
				callback(null, items);
			}
		});
	}
	/*
	 * addPost
	 * This function adds new post to the database - with null comment
	 */
	this.addPost = function(title,body,author, labels,callback)
	{
		// build a permalink
		var permalink = title.replace(/\s/g,'_');
		permalink = permalink.replace(/\W/g,'');
		
		// create a unique permalink
		permalink = permalink +"_" +  ((new Date()).getTime()).toString();
		
		post = {"body": body,
				"author":author, 
				"title":title,
				"permalink":permalink, 
				"labels":labels,
				"comments":[],
				"date": new Date() }
				
		posts.insert(post, function(err, result){
			if (err) {
				callback(err, null);
			}
			else {
				console.log("post inserted");
				console.log("permalink of inserted post" + permalink);
				callback(null, permalink);
			}
		});
	};
	
	
	/*
	 * getPostByPermalink
	 * Return a post with given permalink. If match not found, return null
	 * 
	 */
	this.getPostByPermalink = function(permalink, callback)
	{
		posts.findOne({"permalink":permalink},function(err, post){
			if (err) callback(err, null);
			else
				callback(null, post);
		});
	}
	
	/*
	 * addComment
	 * Add comment to a post defined by permalink
	 */
	this.addComment =  function(permalink,  author, body, email, callback){
		var comment = {"author":author,
						"body":body,
						"email":email,
						"date":new Date()};
		posts.update({'permalink':permalink},{'$push':{'comments':comment}}, function(err, post){
			if (err) return callback(err,null);
			else {
				return callback(null, post)
			}
		});
		
	};
}



module.exports.PostsDAO = PostsDAO;