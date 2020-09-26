const mongoose = require('mongoose');

//Schema 
const homeawaySchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    imageId: String,
    price: Number,
    rooms: Number,
    location: String,
    lat: Number,
    lng: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }, ],

});

//Model 
module.exports = mongoose.model('Homeaway', homeawaySchema);