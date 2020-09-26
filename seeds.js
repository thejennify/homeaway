const mongoose = require("mongoose"),
	  Homeaway = require("./models/listings"),
	  Comment= require ("./models/comment"),
	  User = require("./models/user");


/*const listingData = [
	{
		title: "Stunning 3 bedroom apartmnet in Downtown",
		image: "https://images.unsplash.com/photo-1541123356219-284ebe98ae3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
		description: "3 bedrooms 2 bathrooms, 5 minutes away from Downtown and major attractions",
		price: 95,
		rooms: 3
	},
	
	{
		title: "Spacious and Modern loft in Historic center",
		image: "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1055&q=80",
		description: "Brigth and spacious loft, with new amenities and breakfast included",
		price: 105,
		rooms: 1
	},
	
	{
		title: "Large touwnhouse with parking and swimming pool",
		image: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
		description: "Brigth and spacious loft, with new amenities and breakfast included",
		price: 215,
		rooms: 5
		
	}
]*/

function seedDB() {
	User.deleteMany({}, (err)=>{
		console.log("Deleted Users");
	})
	
Homeaway.deleteMany({}, (err)=>{
	console.log("Wipped DB");
	//Add new listings 
	/*listingData.forEach(data =>{
		Homeaway.create(data, (err, listing)=>{
			err? console.log(err): console.log(listing);
		
	//create comment 
	Comment.create( 
			{text: "This place was sparking clean, I really enjoyed my stay",
			 author: "Tolu12"
			}	
		, (err, comment)=>{
			if (err) {
				console.log(err)
				
			}else {
				listing.comments.push(comment);
			    listing.save();

		   }		
	    })
	 })
  })
*/	
})
}

module.exports= seedDB;