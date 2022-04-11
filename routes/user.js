const router = require('express').Router();
const cryptoJs = require('crypto-js');

const User = require('../models/user');
const verify = require('../verifytoken');
//UPDATE

router.put("/:id", verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = cryptoJs.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString();
        }
        try {
            const updates = await User.findByIdAndUpdate(req.params.id, { $set: req.body, });
            res.status(200).json("Your Crendiatials are updated");
        }
        catch (err) {
            res.status(403).json("You can update only your crendiatials");
        }
    }
})


//DELETE

router.delete("/:id", verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User data is successfully Deleted");
        }
        catch (err) {
            res.status(500).json("You are not allowed to delete this account");
        }
    }
})

//GET
router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...info } = user._doc;
        res.status(200).json(info);
    }
    catch (err) {
        res.status(500).json(err);
    }
})
//GET all will return latest 10 new users
router.get("/", verify, async (req, res) => {
    const query = req.query.new;
    if (req.user.isAdmin) {
        try {
            const user = query ? await User.find().limit(10) : await User.find();
            res.status(200).json(user);
        }
        catch
        {
            res.status(403).json("You are not allowed to see all the users");
        }
    }
})
//GET USER STATS
router.get("/stats", async (req, res) => {
    const today = new Date()
    const lastyear = today.setFullYear(today.setFullYear() - 1);//Condition for the last year
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;