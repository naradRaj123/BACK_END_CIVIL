const express=require('express');
const routes=express.Router();
const UserResgisterRoute=require('../App/routes/UserRoute');
const DefaulterRoute=require('../App/routes/DefaulterRoute');

routes.use(UserResgisterRoute);
routes.use(DefaulterRoute);

module.exports=routes;
