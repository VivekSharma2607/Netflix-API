const router = require('express').Router();
const List = require('../models/list');
const verify = require('../verifytoken');


//ADD A NEW LIST
router.post("/add" , verify , async(req , res)=>{
    if(req.user.isAdmin)
    {
        const newlist = new List(req.body);
        try
        {
            const lists = await newlist.save();
            res.status(200).json(lists);
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    }
    else
    {
        res.status(500).json("You are not allowed to create a list")
    }
})
//GET 
router.get("/" , verify , async(req , res) => {
    const typeq = req.query.type
    const genreq = req.query.genre;
    let list = [];
    try 
    {
        if(typeq)
        {
            if(genreq)
            {
                list = await List.aggregate([
                    {$sample : {size : 10}},
                    {$match : {type : typeq , genre : genreq}},
                ]);
            }
            else
            {
                list = await List.aggregate([
                    {$sample : {size : 10}},
                    {$match : {type : typeq}}
                ])
            }
        }
        else
        {
            list = await List.aggregate([{$sample : {size : 10}}]);
        }
        res.status(200).json(list);
    }
    catch(err){
        res.status(500).json(err);
    }
})
module.exports = router;