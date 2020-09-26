require("dotenv").config();
const PORT                        = process.env.PORT || 3000,
      express                     = require("express"),
      app                         = express(),
      bodyParser                  = require("body-parser"),
      mongoose                    = require('mongoose'),
      Homeaway                    = require("./models/listings"),
      seedDB                      = require("./seeds"),
	  Comment                     = require("./models/comment"),
      User                        = require("./models/user"),
	  session                     = require("cookie-session"),
	  passport                    = require("passport"),
	  passportLocalMongoose       = require("passport-local-mongoose"),
	  methodOverride              = require("method-override"),
	  flash                       = require('connect-flash');
	
//###################### ROUTES CONFIGURATION ######################
const commentRoutes               = require("./routes/comments"),
	  indexRoute                  = require("./routes/index"),
	  listingsRoutes              = require("./routes/listings");

//######################FLASH CONFIGURATION ####################
 app.use(flash());

//###################### PASSPORT CONFIGURATION ####################
//DB config
mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(()=>{
	console.log("Connected to DB")
}).catch(err=>{
	console.log("error", err.message);
});

 app.use(session({
	cookie: { maxAge: 86400000 },
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//seedDB(); 

//################## APP configuration ############################	 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//middleware for currentUser, calls the function for every route
app.use(function (req, res, next){
	res.locals.currentUser    = req.user;
	res.locals.errorMessage   = req.flash("error");
	res.locals.successMessage = req.flash("success");
	next();
})

//############### ROUTES CONFIG #####################################

app.use(indexRoute);
app.use(listingsRoutes);
app.use(commentRoutes);

//######################################################

app.listen(PORT, ()=>{
console.log(`app is running on port ${PORT}`);
})