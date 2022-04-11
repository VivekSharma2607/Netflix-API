const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            unique : true
        },
        desc : {
            type : String,
        },
        img : {
            type : String,
        },
        imgTitle : {type : String},
        trailer : {type : String},
        vedio : {type : String},
        year : {type : String},
        limit : {type : Number},
        genre : {type : String},
        isSeries : {type : Boolean , default : false},
    },
    {timestamps : true}
);

module.exports = mongoose.model("Movie" , MovieSchema);