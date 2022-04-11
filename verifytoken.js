const  jwt = require('jsonwebtoken');

function verify(req , res , next)
{
    const auth_header = req.headers.token;
    if(auth_header)
    {
        const auth_token = auth_header.split(" ")[1];
        jwt.verify(auth_token , process.env.SECRET_KEY, (err , user)=> {
            if(err) res.status(403).json("Token is not valid");
            req.user = user
            next();
        })
    }
    else
    {
        return res.status(401).json("You are not authenticated");
    }
}   
module.exports = verify;