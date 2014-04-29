var PostsDAO = require('../dao/posts').PostsDAO;
var SessionDAO = require('../dao/session').SessionDAO;
/* 
 * function ContentHandler must be constructed with parameter db
 */
function ContentHandler(db){
	
	var posts = new PostsDAO(db);
	var sessions = new SessionDAO(db);
	
	this.index = function(req, res){
		res.render('index', { title: 'Express'});
	};
	
	/*
	 * displayBlogHome
	 * Function to display bog home page
	 */
	this.displayBlogHome = function(req, res, next){
		
		
		posts.getPosts(10, function(err, results){
			if (err)  { return next(err); }
			// get the username from session
			
			else {
				res.render('blog_template', { username:req.username,
												myposts:results });
			}
		});
	};
	
	/*
	 * displaySinglePostbyPermalink
	 * display single post 
	 */
	this.displaySinglePostbyPermalink = function(req,res,next){
		posts.getPostByPermalink(req.params.permalink, function(err,post){
			if (err) return next(err);
			
			res.render('singlePost_template', {username:req.username, post:post});
		});
		
	}
	
	/*
	 * displayNewPostPage
	 * display New post form 
	 */
	this.displayNewPostPage = function (req,res, next){
		res.render('newPost_template',{body:"",
										subject:"",
										author:req.username,
										labels:""});
	};
	
	/*
	 * handleNewPost
	 */
	this.handleNewPost = function(req, res, next){
	
		var body = req.body.body;
		
		sessions.getUsername( req.cookies.session, function(err,username){
			if (!err && username)
				{
					var title = req.body.subject;
					var labels = req.body.labels;
					posts.addPost(title, body, username, labels, function(err, permalink){
						if (err) throw err;
						else {
							// redirect to the display post
							return res.redirect("/post/"+permalink);
							
						};
					});
				}
			else {
				return res.redirect('/');
			}
				
		});
	};
	
	/*
	 * displayCommentPagebyPermalink
	 */
	this.displayCommentPagebyPermalink = function(req,res,next){
		var plink = req.params.permalink;
		console.log("plink" + plink);
		posts.getPostByPermalink(req.params.permalink, function(err,post){
			if (err) return next(err);
			
			res.render('comment' ,{username:req.username, 
									post:post});
		});
	};
	
	/*
	 * handleNewComment
	 */
	this.handleNewComment = function(req, res, next){
		 var name = req.body.commentName;
	        var email = req.body.commentEmail;
	        var body = req.body.commentBody;
	        var permalink = req.body.permalink;
		        
	        // even if user is not logged in, user can still post a comment
	        posts.addComment(permalink, name, body, email, function(err, updated) {

	            if (err) return next(err);

	            if (updated == 0) return res.redirect("/post_not_found");

	            return res.redirect("/comments/" + permalink);
	        });
	};
	
}

module.exports = ContentHandler;
