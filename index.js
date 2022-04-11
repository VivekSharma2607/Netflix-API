const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const movieRoute = require('./routes/movie')
const listRoute = require('./routes/list')
dotenv.config();

mongoose.connect(process.env.MONGO_URL , {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    })
    .then(() => console.log("DataBase connection Successfull"))
.catch((err) => console.log(err));

app.use(express.json());

app.use("/api/auth" , authRoute); 
app.use("/api/users" , userRoute);
app.use("/api/movie" , movieRoute);
app.use("/api/list" , listRoute);
app.get('/' , (req , res)=>{
    res.send("Hello From The netflix clone")
})

app.listen(3000 , ()=>{
    console.log("Server Connected");
})