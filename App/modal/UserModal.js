const mongoose=require('mongoose')

const UserRegisterSchema=new mongoose.Schema({
    gst_no:{
        type:String,
        require:true,
        default:null
    },
    pan_no:{
        type:String,
        default:null,
    },
    firm_name:{
        type:String,
        require:true,
        default:null,
    },
    user_name:{
        type:String,
        require:true,
        default:null,
    },
    mobile_no:{
        type:Number,
        require:true,      
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        default:null,
    },
    user_img:{
        type:String,
        require:true,
        default:null
    },
    otp_expiry:{
        type:String,
        default:null,
    },
    otp:{
        type:Number,
        default:null,
    },
    business_type:{
        type:String,
        default:null
    },
    country:{
        type:String,
        default:null
    },
    state:{
        type:String,
        default:null,
    },
    address:{
        type:String,
        default:null
    },
    city:{
        type:String,
        default:null
    }
},{
    timeseries:true,
});

const user_schema=mongoose.model('Users',UserRegisterSchema);
module.exports=user_schema;