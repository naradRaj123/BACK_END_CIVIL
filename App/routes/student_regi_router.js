require('dotenv').config();
const express=require('express');
const router=express.Router();
const homepage=require('../controller/homepage');
const student_register=require('../controller/Users/register');


router.get('/',homepage.homepage);
router.post('/registerStudent',student_register.StudentRegister);
router.post('/verify',student_register.verifyOtp);
router.get('/studentlist',student_register.ListofStudent);
router.post('/studentbyid',student_register.StudentInfoById);
router.post('/login-user',student_register.LoginStudentByNumber)

module.exports=router;
