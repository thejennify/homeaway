const express = require("express"),
	  router = express.Router(),
	  Homeaway = require("../models/listings"),
	  Comment  = require("../models/comment"),
	  middleware = require("../middleware");



router.get("/listings/:id/comments/new", middleware.isLoggedIn, (req, res)=>{
	const homeawayId = req.params.id;
	Homeaway.findById(homeawayId, (err, homeaway)=>{
		err? console.log(err) : res.render("comments/new", {homeaway : homeaway});
	})
})

router.post("/listings/:id/comments", (req, res)=>{
    Homeaway.findById(req.params.id, (err, homeaway)=>{
		if (err) {
			console.log(err)
		}else {
			Comment.create(req.body.comment, (err, comment) =>{
				if (err) {
					console.log(err)
				} else {
					//User-comment association 
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					
				    //new comment creation 
					homeaway.comments.push(comment);
					homeaway.save()
					req.flash("success", "Your Review has been posted")
					res.redirect("/listings/"+homeaway._id);
				}
			})
		}
	})
	  
})
//###################### COMMENT EDIT ROUTE #################
//comement edit route
router.get("/listings/:id/comments/:comment_id/edit", middleware.verifyCommentOwnership, (req, res)=>{
	Comment.findById(req.params.comment_id, (err, comment)=>{
	 res.render("comments/edit", {homeaway_id: req.params.id, comment: comment});	
})
})

//comment update route 
router.put("/listings/:id/comments/:comment_id", (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
		if(err ){
			console.log(err)
		}else {
		res.redirect("/listings/"+req.params.id);
		}
	})
})

//###################### COMMENT DESTROY ROUTE#########################
router.delete("/listings/:id/comments/:comment_id", middleware.verifyCommentOwnership, (req, res)=>{
	Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
		console.log(req.params.comment_id);
		if(err ){
			console.log(err)
		}else {
		req.flash("success", "review successfully deleted");	
		res.redirect("/listings/"+req.params.id);
		}
	} )
})


module.exports = router;