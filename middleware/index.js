const Homeaway = require("../models/listings"),
	  Comment  = require("../models/comment");

//Add all  future middlewares to the middleware object using dot notation 
const middlewares = {};

middlewares.verifyAccountOwnership = ( req, res, next )=> {

    if ( req.isAuthenticated() ) {
		Homeaway.findById(req.params.id, (err, homeaway) =>{
		if(err){
		res.redirect("back");
		}else {
			if(homeaway.author.id.equals(req.user._id)){
			res.render("listings/edit", {homeaway:homeaway});
			}else{
			res.redirect("back");
				
			}
		}
	})	
	}else {
	    req.flash("error", "You do not have permission to so that");
	}
}	

middlewares.verifyCommentOwnership = ( req, res, next )=> {
    if ( req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, comment)=>{
		if(err){
		res.redirect("back");
		console.log(err);
		}else {
			if(comment.author.id.equals(req.user._id)){
			next();
			}else{
			res.redirect("back");
				
			}
		}
	})	
	}else {
	req.flash("error", "You do not have permission to so that");
	
	}
};

middlewares.isLoggedIn=(req, res, next)=>{
	if (req.isAuthenticated()) {
		return next();
	}
	//flash message
	req.flash("error", "please log in first");
	res.redirect("/login");
};

//export middleware 
module.exports = middlewares;
