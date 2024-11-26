const studentModal=require('../../modal/StudentModal')
const bcrypt=require('bcrypt');
const jwttoken=require('jsonwebtoken');
const UserModal=require('../../modal/UserModal');
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
        let userData=new UserModal({gst_no,pan_no,firm_name,user_name,mobile_no,email,password:hashPassword})        
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

// exports.verifyOtp=async (req,res)=>{
    //     let {email,otp}=req.body;
//     if(!otp){
//         return res.status(404).json({status:0,msg:"Please Enter Otp"})
//     }
//     if(!email){
//         return res.status(404).json({status:0,msg:"Please Enter Email"})
//     }
//     const userdata=await studentModal.findOne({email})
//     const currentDateTime=new Date();
//     if(userdata){
//         // console.log(userdata.otp)
//         if(otp===userdata.otp){
//             if(currentDateTime>=userdata.otp_expirytime){
//                 const token=jwttoken.sign({id:userdata._id},process.env.JWT_TOKEN_KEY)
//                 return res.status(200).json({status:1,msg:"OTP Verify Successful",token})
//             }else{
//                 return res.status(408).json({status:0,msg:"Otp Expire"})
//             }
//         }else{
//             return res.status(409).json({status:0,msg:"Please Enter Valid Otp"})
//         }
//     }

// }

exports.ListofStudent = async (req,res)=>{
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
                return  res.status(200).json({status:1,message:"Sucessfully Login"})
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

// exports.StudentInfoById=async (req,res)=>{
    //     const{studentId}=req.body
//     try{

//         console.log("this is body",studentId);

//         // console.log(userData);
//         if (!studentId) {
//             return res.status(400).json({status: 0,message: "Please provide a  Student ID.",});
//         }
//         const userData = await studentSchema.findById({_id:studentId})
//         if (!userData) {
//             return res.status(404).json({status: 0,message: "Student not found. Please check the ID.",});
//         }

//         return res.status(200).json({status: 1,userData,});

//     }catch(error){
//         // console.error("Error fetching student data:", error.message); 
//         if(error.value._id){
//             return res.status(500).json({status: 0,message: "Invalid Student ID"});
//         }

//     }
// }

// exports.LoginStudentByNumber=async(req,res)=>{
    //     const {mobileNo,otp}=req.body;

//     try{

//         console.log(req.body)
//         res.send("otp send sucessfully")

//     }catch(error){
//         return res.status(500).json({status:0,Message:"Enter Valid Mobile Number"})
//     }

// }
