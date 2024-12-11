require('dotenv').config();

const jwttoken=require('jsonwebtoken');

exports.verifyUser=async(req,res,next)=>{
    // const authHeader = req.headers.authorization.split('')[1];
    // console.log(authHeader);
    next();
    // jwttoken.verify(authHeader,process.env.JWT_TOKEN_KEY,(error,sucess)=>{
    //     if(error){
    //         return res.status(203).json({status:0,msg:"invalid token key"})
    //     }else{
    //         next();
    //     }
    // })
}