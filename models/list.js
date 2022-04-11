const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            unique : true,
            required : true
        },
        type : {
            type : String
        },
        genre : {
            type : String
        },
        // Add the id of the movies from movie models
        content : {
            type : Array,
        }
    }, 
    {timestamps : true}
)

module.exports = mongoose.model("List" , ListSchema);