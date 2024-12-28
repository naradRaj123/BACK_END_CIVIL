const { default: mongoose } = require('mongoose');
const mongooes=require('mongoose');


// Sub-schema for user_id objects
const UserIdSchema = new mongoose.Schema(
    {
      id: { type: String, required: true }, // Unique user ID
      added_by: { type: String, required: true }, // Who added this user
      date_added: { type: Date, default: Date.now }, // When this entry was added
    },
    { _id: false } // Disable automatic _id creation for subdocuments
  );
  


const DefaulterSchema=new mongooes.Schema({
    user_id:{
        type:[UserIdSchema],
        require:true,
        default:[]
    },
    defaulter_name:{
        type:String,
        require:true,
        default:null,
    },
    added_by:{
        type:[String],
        require:true,
        default:["system"],
    },
    firm_name:{
        type:String,
        require:true,
        default:null
    },
    mobile_No:{
        type:Number,
        require:true,
        unique: true,
        default:null
    },
    gst_no:{
        type:String,
        require:true,
    },
    pan_card_no:{
        type:String,
        require:true,
    },
    aadhar_card:{
        type:Number,
        require:true,
    },
    pending_amount:{
        type:Number,
        require:true,
    },
    address:{
        type:String,
        require:true,
    },
    city:{
        type:String,
        require:true,
    },
    state:{
        type:String,
        require:true
    },
    country:{
        type:String,
        default:null,
        require:true
    },
    remark:{
        type:String,
        default:null
    },
    bankStatement:{
        type:String,
        default:true,
    },
    otherDocument:{
        type:String,
        require:true,        
    },
    cibil_score:{
        type:Number,
        default:75,
    },
    clear_score:{
        type:Number,
        default:true,
    },
    added_on:{
        type:String,
        default:null,
    }
    
},{
    timeseries:true
});

const Defaulter_Schema=mongooes.model('defaulter',DefaulterSchema);
module.exports=Defaulter_Schema;