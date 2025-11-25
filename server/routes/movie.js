let express = require('express')
let router = express.Router();
let mongoose = require('mongoose');

let Movie = require('../models/movie');

//get --> Extract & read
//post--> Post something
//put -->edit/update
//delete -->delete the data

router.get('/',async(req,res,next)=>{
    try
    {
        const MovieList = await Movie.find();
        res.render('Movies/list',{
            title:'Movies',
            MovieList:MovieList,
            displayName: req.user?req.user.displayName:""
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('Movies/list',{
            error:'Error on server'
        })
    }
})
// Get route for displaying the add page- Create operation
router.get('/add',async(req,res,next)=>{
 try
    {
        res.render('Movies/add',{
            title:'Add Movie',
            displayName: req.user?req.user.displayName:""
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('Movies/add',{
            error:'Error on server'
        })
    }
})
// Post route for processing the add page- Create operation
router.post('/add',async(req,res,next)=>{
     try
    {
        let newMovie = Movie({
            "name":req.body.name,
            "description":req.body.description,
            "release":req.body.release,
            "duration":req.body.duration,
            "timeframe":req.body.timeframe
        })
        Movie.create(newMovie).then(()=>{
            res.redirect('/movies')
        });
    }
    catch(err)
    {
        console.error(err);
        res.render('Movies/add',{
            error:'Error on server'
        });
        
    }
})
// Get route for displaying the edit page- Update operation
router.get('/edit/:id',async(req,res,next)=>{
    try{
            const id = req.params.id;
            const movieToEdit = await Movie.findById(id)
            res.render('Movies/edit',
                {
                    title:'Edit Movie',
                    Movie: movieToEdit,
                    displayName: req.user?req.user.displayName:""
                }
            )
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
})
// Post route for processing the add page- Update operation
router.post('/edit/:id',async(req,res,next)=>{
     try{
            let id = req.params.id;
            let updateMovie = Movie({
                "_id":id,
                "name":req.body.name,
                "description":req.body.description,
                "release":req.body.release,
                "duration":req.body.duration,
                "timeframe":req.body.timeframe
            })
            Movie.findByIdAndUpdate(id,updateMovie).then(()=>{
                res.redirect("/movies")
            })
    }
    catch(err){
        console.log(err);
        next(err);
    }
})
// Get route for performing delete operation- Delete operation
router.get('/delete/:id',async(req,res,next)=>{
    try{
            let id = req.params.id;
            Movie.deleteOne({_id:id}).then(()=>{
                res.redirect("/movies")
            })
    }
    catch(err){
        console.log(err);
        next(err);
    }
})
module.exports = router;