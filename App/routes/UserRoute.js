require('dotenv').config();
const express=require('express');
const router=express.Router();
const verifyUser=require('../middleware/verifyUser');

const UserController=require('../controller/Users/register');
router.get('/',UserController.homepage);
router.post('/register',UserController.userRegister);
router.get('/user-list',UserController.ListofUsers);
router.post('/login-user', verifyUser.verifyUser,UserController.LoginUser);
router.post('/editUser',UserController.EditByUserId);
router.post('/userdataById/:id',UserController.UserInfoById);
router.post('/forgot-password',UserController.ForgotPassword);
router.post('/verifyOtp',UserController.verifyOtp);
router.post('/resendOtp',UserController.ResendOtp);
module.exports=router