const mongoose = require('mongoose');

// Define the sub-schema for user_id objects
// const UserIdSchema = new mongoose.Schema(
//   {
//     id: { type: mongoose.Schema.Types.ObjectId, required: true }, // User ID
//     added_by: { type: String, required: true }, // User who added this ID
//   },
//   { _id: false } 
// );

// Define the main schema
const DefaulterSchema = new mongoose.Schema({
  user_id: {
    type: [String], // Array of objects using the UserIdSchema
    required: true,
    default: [], // Default to an empty array
  },
  defaulter_name: {
    type: String,
    required: true,
    default: null,
  },
  firm_name:{
    type:String,
    require:true,
    default:null
  },
  mobile_No: {
    type: Number,
    required: true,
    unique: true,
    default: null,
  },
  gst_no: {
    type: String,
    required: true,
  },
  pan_card_no: {
    type: String,
    required: true,
  },
  aadhar_card: {
    type: Number,
    required: true,
  },
  pending_amount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: null,
  },
  remark: {
    type: String,
    default: null,
  },
  bankStatement: {
    type: String,
    default: null,
  },
  otherDocument: {
    type: String,
    required: true,
  },
  cibil_score: {
    type: Number,
    default: 75,
  },
  clear_score: {
    type: Number,
    default: 1,
  },
  added_on: {
    type: Date,
    default: Date.now,
  },
  added_by:{
    type:String,
    default:null
  },
});

// Create the model
const DefaulterModel = mongoose.model('Defaulter', DefaulterSchema);
module.exports = DefaulterModel;
