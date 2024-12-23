require('dotenv').config();

const DefaulterSchema = require('../../modal/Defaulter');
const fs = require('fs');
const user_schema = require('../../modal/UserModal');
// const path=require('path');


// add defaulter by user id 
exports.AddDefaulterByUser = async (req, res) => {
    const { user_id, defaulter_name, mobile_No, aadhar_card, address, city, state, firm_name, gst_no, pan_card_no, pending_amount, remark } = req.body;
    const bankStatement = req.files?.bankStatement?.[0]?.filename;
    const otherDocs = req.files?.otherDocs?.[0]?.filename;
    const bankpath = '/upload/' + bankStatement;
    const otherDocsPath = '/upload/' + otherDocs;
    // console.log(bankStatement);

    // user data information by user id
    const userallData = await user_schema.findOne({ _id: user_id });
    const currentTime=new Date();


    // check defaulter defaulter avilable
    // const defaulterData=await  DefaulterSchema.find({gst_no:})
    

    // Validate file uploads
    if (!bankStatement) return res.status(400).json({ status: 0, msg: "Please Upload bank Statement" });
    if (!otherDocs) return res.status(400).json({ status: 0, msg: "Please Upload Other Document" });

    try {
        const defaulterData = new DefaulterSchema({user_id, defaulter_name, mobile_No, aadhar_card, address, city, state, firm_name, gst_no, pan_card_no, pending_amount: pending_amount, remark, bankStatement: bankpath, otherDocument: otherDocsPath , added_by :userallData.user_name , added_on : currentTime
        });
        const defaulterResponseData = await defaulterData.save();
        // Response after successful save
        return res.status(200).json({status:1, msg: 'Defaulter added successfully', data: defaulterResponseData });
    } catch (error) {
        console.error('Error adding defaulter:', error);
        if (error.errors.aadhar_card.valueType == "string") {
            return res.status(409).json({ status: 0, msg: 'Please Enter Valid aadhar card ' });
        }
        return res.status(500).json({ msg: 'Error adding defaulter' });
    }
};


// Get  all  list of defaulter
exports.listOfDefaulter = async (req, res) => {
    const listofDefaulter = await DefaulterSchema.find();
    if (listofDefaulter) {
        return res.status(200).json({ status: 1, list: listofDefaulter, staticPath: 'http://localhost:8000' });
    } else {
        return res.status(404).json({ status: 0, message: "Data Not Avilable" })
    }
}


// List of defaulter by user ID
exports.infoDefaulterByUserId = async (req, res) => {
    const { user_id } = req.body;
    const DefaulterData = await DefaulterSchema.find({ user_id: user_id });
    // extrack data from db by user id
    try {
        if (DefaulterData) {
            return res.status(200).json({ status: 1, data: DefaulterData, staticPath: "https://back-end-civil.onrender.com/" });
        } else {
            return res.status(404).json({ status: 0, Message: "Defaulter Not Found Found" })
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: "Something went to wrong ! Please try Again" })
    }
}


// defaulter search by name , pancard , aadhar card , Gst No,  mobile No Function start
exports.SearchDefaulterData = async (req, res) => {

    const { defaulter_name, pan_card_no, aadhar_card, gst_no, mobile_No } = req.body;
    console.log(req.body);

    const searchCriteria = {};

    if (defaulter_name) searchCriteria.defaulter_name = defaulter_name;
    if (pan_card_no) searchCriteria.pan_card_no = pan_card_no;
    if (aadhar_card) searchCriteria.aadhar_card = aadhar_card;
    if (gst_no) searchCriteria.gst_no = gst_no;
    if (mobile_No) searchCriteria.mobile_No = mobile_No;

    // console.log(searchCriteria)

    const defaluterData = await DefaulterSchema.updateOne({ searchCriteria: searchCriteria });
    console.log(defaluterData);
    const updateData = {};

    // Dynamically construct the update object


    res.send("this is demo");
}
// defaulter search by name , pancard , aadhar card , Gst No, Mobile No Function end


// defaulter cibil score clean apis
exports.ClearDefaulterCibilScore = async (req, res) => {
    const { user_id, defaulter_id } = req.body;
    if (!user_id) return res.status(400).json({ status: 0, Message: "User Id Not found" })
    if (!defaulter_id) return res.status(400).json({ status: 0, Message: "Defaulter  Id Not found" })
    res.send("clear score of cibil ")
    // try {

    // } catch (error) {
    //     return res.status(500).json({ status: 0, Message: "Something Wrong Please try Again !" })
    // }

}