const express=require('express');
const routes=express.Router();
const UserResgisterRoute=require('../App/routes/UserRoute')

routes.use(UserResgisterRoute);

module.exports=routes;
