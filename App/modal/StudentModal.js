const mongooes=require('mongoose');

const studentRegisterSchema= new mongooes.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    mobileNo:{
        type:Number,
        default:null
    },
    gender:{
        type:String,
        default:null
    },
    qualification:{
        type:String,
        default:null,
    },
    address:{
        type:String,
        default:null,
    },
    image:{
        type:String,
        default:null,
    },
    password:{
        type:String,
        require:true
    },
    otp:{
        type:Number,
        default:null
    },
    otp_expirytime:{
        type:String,
        default:null
    }
},{
    timestamps:true
});

const studentSchema=mongooes.model('students',studentRegisterSchema);
module.exports=studentSchema;