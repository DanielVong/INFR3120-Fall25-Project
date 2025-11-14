let mongoose = require("mongoose")

//CREATE A MODEL
let movieModel = mongoose.Schema(
    {
        name:String, 
        description:String,
        release:Number,
        duration:Number,
        timeframe:String
    },
    {
        collection: "movies"
    }
);
module.exports = mongoose.model('Movie',movieModel);