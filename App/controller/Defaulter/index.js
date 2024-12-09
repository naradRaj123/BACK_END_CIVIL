require('dotenv').config();

const DefaulterSchema=require('../../modal/Defaulter');
const fs=require('fs');
// const path=require('path');

exports.AddDefaulterByUser = async (req, res) => {
    const { userName, mobileNo, pan_card, addharcard, address, cityName, stateName, firmName, gstNo, pendingAmount, remark } = req.body;
    const bankStatement = req.files?.bankStatement?.[0]?.filename;
    const otherDocs = req.files?.otherDocs?.[0]?.filename;
     const bankpath='/upload/'+bankStatement;
     const otherDocsPath='/upload/'+otherDocs;
     
    // Validate file uploads
    if (!bankStatement) {
        return res.status(400).json({ status: 0, message: "Please Upload bank Statement" });
    }
    if (!otherDocs) {
        return res.status(400).json({ status: 0, message: "Please Upload Other Document" });
    }
    try {       
        const defaulterData = new DefaulterSchema({userName, mobileNo, pan_card, addharcard, address, cityName, stateName, firmName, gstNo, pendingAmount, remark,bankStatement:bankpath, otherDocument:otherDocsPath});
        const defaulterResponseData = await defaulterData.save();
        // Response after successful save
        res.status(200).json({message: 'Defaulter added successfully',data: defaulterResponseData}); 
    } catch (error) {
        console.error('Error adding defaulter:', error);
        res.status(500).json({ message: 'Error adding defaulter', error });
    }
};


// list of defaulter
exports.listOfDefaulter=async(req,res)=>{
    const listofDefaulter=await DefaulterSchema.find();
    if(listofDefaulter){
        return res.status(200).json({status:1,list:listofDefaulter,staticPath:'http://localhost:8000'})
    }else{
        return res.status(404).json({status:0,message:"Data Not Avilable"})
    }

}

