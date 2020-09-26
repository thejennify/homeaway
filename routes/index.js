//express router 
const express                     = require("express"),
      router                      = express.Router(),
      User                        = require("../models/user"),
      passport                    = require("passport"),
	  flash                       = require('connect-flash');

//SIGNUP route 
router.get("/signup", (req, res) => {
    res.render("user/signup");
});

router.post("/signup", (req, res) => {
      User.register({
        username: req.body.username
    }, req.body.password, (err, user) => {
		  
        if (err) {
			console.log(err)
            req.flash("error", err.message);
            res.redirect("/signup");
        } else {
                passport.authenticate("local")(req, res, ()=> {
                req.flash("success", `Welcome ${req.body.username}`);
                res.redirect("/listings");
            })
        }
    })
});

//LOGIN route 
router.get("/login", (req, res) => {
    res.render("user/login");
})

router.post("/login", (req, res) => {
	//store new username and password 
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, (err)=> {
		if (err){
		    req.flash("error", "username or password is incorrect");
			res.redirect("/login");	
		}
		   
		if (user.username == ""){
					req.flash("error", "username cannot be empty");
					res.redirect("/login"); 
				}
		if (user.password == ""){
					req.flash("error", "password cannot be empty");
					res.redirect("/login"); 
				}

			   
			passport.authenticate("local")(req, res, () => {
				if (!user){
				req.flash("error", "username or password is incorrect");
				}
				req.flash("success", "You are Logged in!")
				res.redirect("/listings");
          })
    })
});

//LOGOUT route 
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You were succesfully logged out!")
    res.redirect("/listings");
})


module.exports = router;
