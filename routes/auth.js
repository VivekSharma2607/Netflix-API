// Creating the Register and Login Method

const router = require('express').Router();
const User = require("../models/user");
const Cryptojs = require("crypto-js");
const jwt = require('jsonwebtoken');
//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: Cryptojs.AES.encrypt(
            req.body.password, 
            process.env.SECRET_KEY
        ).toString(),
    });
    console.log(newUser);
    try {

        const user = await newUser.save();
        res.status(201).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
});


router.post("/login" ,async(req , res) => {
    try{
        const user = await User.findOne({email  : req.body.email});
        !user && res.status(401).json("Wrong Crediatials");
        const bytes = Cryptojs.AES.decrypt(user.password , process.env.SECRET_KEY);
        const originalpass = bytes.toString(Cryptojs.enc.Utf8);

        originalpass !== req.body.password && res.status(401).json("Wrong Crendiatials");
        //JWT Tokenaziation
        const auth_token = jwt.sign(
            {
                id : user._id ,
                isAdmin : user.isAdmin
            },process.env.SECRET_KEY,
            {expiresIn : "5d"}
        );


        //Used to send all the information without the password
        const {password, ...info} = user._doc ;
        //Printing all the info and accesstoken as well
        res.status(200).json({...info , auth_token});
    }
    catch(err){
        res.status(500).json(err);
    }
})
module.exports = router;