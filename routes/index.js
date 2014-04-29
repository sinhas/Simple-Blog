var SessionHandler = require('./session'),
	ContentHandler = require('./content');


module.exports = exports = function(app,db){
	
	var sessionHandler = new SessionHandler(db);
	var contentHandler = new ContentHandler(db);
	
	// verifyy is user is logged to middleware
	app.use(sessionHandler.isUserLogged);
	
	
	// Main page of the blog
	app.get('/', contentHandler.displayBlogHome);
	 
	// Signup form
	app.get('/signup', sessionHandler.displaySignupPage);
	app.post('/signup', sessionHandler.handleSignup);
	 
	// login form
	app.get ('/login', sessionHandler.displayLoginPage);
	app.post('/login', sessionHandler.handleLogin);
	 
	//logout
	app.get('/logout',sessionHandler.displayLogoutPage);
	 
	//display single post by permalink
	app.get('/post/:permalink',contentHandler.displaySinglePostbyPermalink);
	
	//display post comment
	app.get('/comments/:permalink',contentHandler.displayCommentPagebyPermalink);
	app.post('/newComment', contentHandler.handleNewComment);
	 
	// new post form
	app.get('/newPost', contentHandler.displayNewPostPage);
	app.post('/newPost',contentHandler.handleNewPost);
	
}
