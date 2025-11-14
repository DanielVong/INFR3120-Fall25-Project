let express = require('express')
let router = express.Router();
let mongoose = require('mongoose');

let Book = require('../models/movie');

//get --> Extract & read
//post--> Post something
//put -->edit/update
//delete -->delete the data

router.get('/',async(req,res,next)=>{
    try
    {
        const MovieList = await Movie.find();
        //console.log(BookList);
        res.render('movie',{
            title:'Movies',
            MovieList:MovieList
        })
    }
    catch(err)
    {
        console.error(err);
        //res.render
    }
})
module.exports = router;