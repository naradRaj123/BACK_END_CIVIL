require('dotenv').config();
const express=require('express');
const router=express.Router();

const UserController=require('../controller/Users/register');
router.get('/',UserController.homepage);
router.post('/register',UserController.userRegister);
router.get('/user-list',UserController.ListofStudent);
router.post('/login-user',UserController.LoginUser);

module.exports=router