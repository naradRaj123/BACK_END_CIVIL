const studentModal=require('../../modal/StudentModal')
const bcrypt=require('bcrypt');
const jwttoken=require('jsonwebtoken');

const user_schema = require('../../modal/UserModal');

exports.homepage= async(req,res)=>{
    res.send("Welcome to Home routes");
}

exports.userRegister= async (req ,res)=>{    
    const {gst_no,pan_no,firm_name,user_name,mobile_no,email,password}=req.body;
    if(gst_no=="" || firm_name=="" || user_name=="" || mobile_no=="" || email=="" || password=="" ){
        return res.status(409).json({status:0,msg:'All field are Required'}); 
    }
    const salthRound=10;
    const hashPassword=await bcrypt.hash(password,salthRound);
    try{
        let userData=new user_schema({gst_no,pan_no,firm_name,user_name,mobile_no,email,password:hashPassword})        
        const userResponse = await userData.save()
        .then((insertdata)=>{
            // send mail
            res.status(200).json({ status: 1, message: `Register successfull`});
        })
        
    }catch(error){
        // if(error.errorResponse.keyPattern.email){
        //     res.status(409).json({status:0,msg:'Email already Exists Please Try another email'}); 
        // }
        res.status(409).json({status:0,msg:'Registration fail something went wrong'}); 
        // res.send({error});
    }
}


exports.ListofUsers = async (req,res)=>{
    try{
        const userdata= await user_schema.find();
        if(userdata.length>0){
            return res.status(200).json({status:1,userdata})
        }else{
            return res.status(200).json({status:0,msg:"Student Not Avilable"})
        }        
    }catch(error){
        return res.status(404).json({status:0,msg:"Something went to wrong Please try again"})
    }
}

exports.LoginUser=async(req,res)=>{
    console.log(req.body)
    const {email,password}=req.body;
    try{
        if(email==""){
            return res.status(404).json({status:0,message:"Email required"});
        }
        if(password==""){
            return res.status(404).json({status:0,message:"Password required"});
        }
        
        const userData=await user_schema.findOne({email});
        if(userData){
            console.log(userData.password)
            let user_password=await bcrypt.compareSync(password,userData.password)
            console.log(user_password)
            if(user_password){
                return  res.status(200).json({status:1,message:"Sucessfully Login",userlist:userData})
            }else{
                return  res.status(404).json({status:0,message:"Password Not match "})
            }
            
        }else{
            return res.status(404).json({status:0,message:"User Not Found"})
        }
                
    }catch(error){
        return res.status(500).json({status:0,message:"Something went Wrong try Sometime"});
    }
    
}

exports.UserInfoById=async (req,res)=>{
        const{userId}=req.body
    try{

        if (!userId) {
            return res.status(400).json({status: 0,message: "Please provide a  Student ID.",});
        }
        const userData = await user_schema.findById({_id:userId})
        if (!userData) {
            return res.status(404).json({status: 0,message: "User not found. Please check the ID.",});
        }
        return res.status(200).json({status: 1,userData,});

    }catch(error){
        // console.error("Error fetching student data:", error.message); 
        if(error.value._id){
            return res.status(500).json({status: 0,message: "Invalid Student ID"});
        }
    }
}


// user edit by id 
exports.EditByUserId= async (req,res)=>{
    const {user_id,user_name,gst_no,pan_no,firm_name,mobile_no}=req.body;
    const updateData={};
    if (user_name) updateData.user_name = user_name;
    if (gst_no) updateData.gst_no = gst_no;
    if (pan_no) updateData.pan_no = pan_no;
    if (firm_name) updateData.firm_name = firm_name;
    if (mobile_no) updateData.mobile_no = mobile_no;
    const result = await user_schema.updateOne(
        { _id: user_id }, // Query to match the document
        { $set: updateData } // Update operation
    );
    if(result){
       return res.status(200).json({status:1,Message:"Update Sucessfully"})
    }else{
        return res.status(500).json({status:0,Message:"Update Failed "})
    }
}
