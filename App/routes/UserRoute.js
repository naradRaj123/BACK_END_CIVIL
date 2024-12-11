require('dotenv').config();
const express=require('express');
const router=express.Router();

const UserController=require('../controller/Users/register');
router.get('/',UserController.homepage);
router.post('/register',UserController.userRegister);
router.get('/user-list',UserController.ListofUsers);
router.post('/login-user',UserController.LoginUser);
router.post('/editUser',UserController.EditByUserId);


module.exports=router