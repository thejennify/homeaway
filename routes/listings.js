const express         = require("express"),
      router          = express.Router(),
      Homeaway        = require("../models/listings"),
      middleware      = require("../middleware"),
      multer          = require('multer'),
      cloudinary      = require('cloudinary'),
      NodeGeocoder    = require('node-geocoder'),
      options         = {
                       provider: 'google',
                       httpAdapter: 'https',
                       apiKey: process.env.GEOCODER_API_KEY,
                       formatter: null
                      },
      geocoder        = NodeGeocoder(options);
 
//#####################MULTER AND CLOUDINARY CONFIG #########################

//multer image storage 
const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});

const imageFilter = (req, file, cb) => {
    // specifies the type of file accepted
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: imageFilter
});
cloudinary.config({
        cloud_name: process.env.CLOUDINARY_USERNAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

//############### ROUTES ###########################################
//# Homepage route 

router.get("/", (req, res) => {
        return res.redirect("/listings");
})

//# INDEX ROUTE - displays all listings 
router.get("/listings", (req, res) => {
    Homeaway.find({}, (err, homeaways) => {
        err ? errorHandling() : res.render("listings/listings", {
            homeaways: homeaways
        })
    })
});

//# CREATE ROUTE - saves it to DB and creates new listing 
router.post("/listings", upload.single("image"), (req, res) => {

    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if (err) {
            req.flash("error", "Can't upload image, try again later.");
            return res.redirect('back');
        }
        // cloudinary url for the image to the object under image property
        req.body.image = result.secure_url;
        req.body.imageId = result.public_id;

        //get data from listing form and store it in a variable
        const title = req.body.title,
            image = req.body.image,
            imageId = req.body.imageId,
            price = req.body.price,
            rooms = req.body.rooms,
            description = req.body.description,
            author = {
                id: req.user._id,
                username: req.user.username
            };
		
        //takes the location input from the new form and geocodes it to lat and lng coordinates
        geocoder.geocode(req.body.location, (err, data) => {
            console.log(err);
            console.log(req.body.location)
            if (err || !data.length) {
                console.log(data.length);
                req.flash('error', 'invalid address');
                return res.redirect('back');
            }
            // store information about location obtained from geocoding 	
            let lat = data[0].latitude;
            let lng = data[0].longitude;
            let location = data[0].formattedAddress;

            //store all the data in newListing object passed to the create method 
            const newListing = {
                title: title,
                image: image,
                imageId: imageId,
                price: price,
                description: description,
                rooms: rooms,
                author: author,
                location: location,
                lat: lat,
                lng: lng,
            }
			
            //create new listing with data from the newListing Object 
            Homeaway.create(newListing, (err, homeaway) => {
                console.log(newListing)
                err ? req.flash(err.errorMessage) : res.redirect('/listings')
            })
        })
    })
});


//# NEW route - displays form to create new listing and sends it to the create route 
router.get("/listings/new", middleware.isLoggedIn, (req, res) => {
    res.render("listings/new");
})

//# SHOW route - shows more info about  one listing 
router.get("/listings/:id", (req, res) => {
    const homeawayId = req.params.id;
    Homeaway.findById(homeawayId).populate('comments').exec((err, homeaway) => {
		for (const field in homeaway) {
			if (field.length < 1){
				req.flash("error", `${field} cannot be empthy`);
				res.render("listings/new")
			}
  
        }
		
        err ? console.log(err) : res.render("listings/show", {
            homeaway: homeaway
        })
    })
});

//######################## UPDATE ROUTE ################

//EDIT route
router.get("/listings/:id/edit", middleware.verifyAccountOwnership, (req, res) => {
    Homeaway.findById(req.params.id, (err, homeaway) => {
        res.render("listings/edit", {
            homeaway: homeaway
        });
    })
})

//UPDATE route
router.put("/listings/:id", upload.single("image"), (req, res) => {
    Homeaway.findById(req.params.id, async (err, homeaway) => {

        if (err) {
            errorHandling();
        } else {
            if (req.file) {
                //deletes previous image saved using image id
                try {
                    await cloudinary.v2.uploader.destroy(homeaway.imageId);
                    //upload new image
                    const result = await cloudinary.v2.uploader.upload(req.file.path);
                    homeaway.image = result.secure_url;
                    homeaway.imageId = result.public_id;
                } catch (err) {
                    errorHandling();
                }
            }
            try {
                const updatedLocation = await geocoder.geocode(req.body.location);
                console.log(req.body.location);
                homeaway.lat = updatedLocation[0].latitude;
                homeaway.lng = updatedLocation[0].longitude;
                homeaway.location = updatedLocation[0].formattedAddress;
            } catch (err) {
                errorHandling();
            }

            homeaway.title = req.body.homeaway.title;
            homeaway.price = req.body.homeaway.price;
            homeaway.rooms = req.body.homeaway.rooms;
            homeaway.location = req.body.location;
            homeaway.description = req.body.homeaway.description;
            homeaway.save();
            req.flash("success", "Successfully Updated!");
            res.redirect("/listings/" + homeaway.id);
        }
    })
});

function errorHandling() {
    req.flash(err.errMessage);
    return res.redirect("back");
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//##################### DESTROY ROUTE ######################
router.delete("/listings/:id", (req, res) => {
    Homeaway.findById(req.params.id, async (err, homeaway) => {
        if (err) {
            errorHandling();
        }
        try {
            //deletes image from the cloudnary database
            await cloudinary.v2.uploader.destroy(homeaway.imageId);
            console.log(homeaway)
            homeaway.remove();
            req.flash("success", "listing has been deleted")
            res.redirect("/listings");
        } catch (err) {
            errorHandling();
        }
    })
});


module.exports = router;
