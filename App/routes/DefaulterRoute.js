require('dotenv').config();
const express=require('express');
const router=express.Router();
const multer=require('multer');
const DefaulterController=require('../controller/Defaulter/index.js');
const upload=require('../multer.js');
const path = require('path');


router.post('/addDefaulter',upload.fields([{ name: 'bankStatement', maxCount: 1 }, { name: 'otherDocs', maxCount: 1 }]), DefaulterController.AddDefaulterByUser);
router.get('/defaluterlist',DefaulterController.listOfDefaulter);
router.post('/listOfDefaulterById',DefaulterController.infoDefaulterByUserId);
router.post('/search',DefaulterController.SearchDefaulterData);
router.post('/cleanDefaulterScore',DefaulterController.ClearDefaulterCibilScore);


module.exports=router;