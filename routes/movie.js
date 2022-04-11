const router = require('express').Router();
const movie = require('../models/movie');
const verify = require('../verifytoken');

//CREATE A NEW ENTRY FOR MOVIE

router.post("/add" , verify ,async  (req,res)=>{
    if(req.user.isAdmin)
    {
        const newMovie = new movie(req.body);
        try{
            const movies = await newMovie.save();
            res.status(500).json(movies);
        }catch(err)
        {
            res.status(500).json(err);
        }
    }
    else
    {
        res.status(500).json("You are not allowed to add movie in the admin panel");
    }
})

//UPDATE THE DETAILS FOR THE MOVIE ENTRIES
router.put("/:id" , verify ,async(req , res)=>{
    if(req.user.isAdmin)
    {
        try
        {
            const updatemovie = await movie.findByIdAndUpdate(
                req.params.id,
                {
                    $set : req.body,
                },
                {new : true}
            );
            res.status(200).json(updatemovie);
        }catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(500).json("You are not allowed to update the stuff in admin panel");
    }
});
//DELETE THE MOVIE FROM THE DATABASE
router.delete("/:id" , verify , async (req,res)=>{
    if(req.user.isAdmin)
    {
        try{
            await movie.findByIdAndDelete(req.params.id);
            res.status(200).json("The movie is deleted from the DataBase");
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    }
    else
    {
        res.status(500).json("You are not allowed to delete the Data from the Database");
    }
})

//GET  THE DETAILS OF THE SPECIFIC MOVIE FROM DATABASE
router.get("/find/:id" , verify , async (req , res) =>{
    try
    {
        const movies = await movie.findById(req.params.id);
        res.status(200).json(movies);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
})

//GET RANDOM MOVIE FROM THE DATABASE
router.get("/random" , verify , async (req , res) => {
    const type = req.query.type;
    let movies;
    try{
        if(type === "series")
        {
            movies = await movie.aggregate([
                {$match : {isSeries : true}},
                {$sample : {size : 1}}
            ]);
        }
        else
        {
            movies = await movie.aggregate([
                {$match : {isSeries : true}},
                {$sample : {size : 1}},
            ]);
        }
        res.status(200).json(movies);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
})
//GET THE DETAILS OF THE MOVIES IN THE DATABASE
router.get("/all" , verify , async(req , res)=>{
    if(req.user.isAdmin)
    {
        try
        {
            const movies = await movie.find();
            res.status(200).json(movies.reverse());
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    }
    else
    {
        res.status(500).json("You don't admin permissions");
    }
})
module.exports = router;