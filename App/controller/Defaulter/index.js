require('dotenv').config();

const DefaulterSchema = require('../../modal/Defaulter');
const fs = require('fs');
const user_schema = require('../../modal/UserModal');
// const path=require('path');


// add defaulter by user id 
// exports.AddDefaulterByUser = async (req, res) => {
//     const { user_id, defaulter_name, mobile_No, aadhar_card, address, city, state, firm_name, gst_no, pan_card_no, pending_amount, remark } = req.body;
//     const bankStatement = req.files?.bankStatement?.[0]?.filename;
//     const otherDocs = req.files?.otherDocs?.[0]?.filename;
//     const bankpath = '/upload/' + bankStatement;
//     const otherDocsPath = '/upload/' + otherDocs;
//     // console.log(bankStatement);

//     // user data information by user id
//     const userallData = await user_schema.findOne({ _id: user_id });
//     const currentTime=new Date();

//     // get user id from defaulter database
//     const userData = await user_schema.findById({ _id: user_id });
//     if (!userData) return res.send({ status: 404, msg: "enter valid user id!" });

//     const userID = userData._id.toString();
//     // console.log(userID);
//     const userId = await DefaulterSchema.find({ user_id: { $in: [userID] } });
//     const defaulterData = await DefaulterSchema.find({ gst_no, pan_card_no })
    


//     if (!userId || userId.length === 0) {
//         // Handle the case when userId is blank or empty
        



//       } else {
//         // Handle the case when userId is not blank
//         console.log("userId is not blank");
//       }

//     console.log(userId)
//     // console.log(userId[0].user_id);
//     // const userIDArr=userId[0].user_id;
//     // console.log(userIDArr.length);
//     res.send("this is add defaluter controller")
//     // push user id in database dafaulter table
//     // const userIdArr = userId[0].user_id;
    

//     // check defaulter defaulter avilable
//     // const defaulterData = await DefaulterSchema.find({ gst_no, pan_card_no })
//     // console.log(defaulterData);
//     // add defaulter not exits
//     // if (!defaulterData) {
//     //     const defaulterData = new DefaulterSchema({
//     //         user_id: [user_id],
//     //         defaulter_name,
//     //         mobile_No,
//     //         aadhar_card,
//     //         address,
//     //         city,
//     //         state,
//     //         firm_name,
//     //         gst_no,
//     //         pan_card_no,
//     //         pending_amount: pending_amount,
//     //         remark,
//     //         bankStatement: bankpath,
//     //         otherDocument: otherDocsPath,
//     //         added_by: userallData.user_name,
//     //         added_on: currentTime,
//     //         added_on1: new Date()
//     //     });
//     //     const defaulterResponseData = await defaulterData.save();
//     //     // Response after successful save
//     //     return res.status(200).json({ status: 1, msg: 'Defaulter added successfully', data: defaulterResponseData });
//     // }

//     // console.log(userIdArr.includes(userID))

//     // if (!userIdArr.includes(userID)) {
//     //     // Add the user_id to the defaulter record
//     //     await DefaulterSchema.findByIdAndUpdate(
//     //         { _id: defaulterData._id },
//     //         { $push: { user_id: userID } }
//     //     );
//     //     return res.status(200).json({ status: 1, msg: 'User ID added to defaulter successfully' });
//     // }
//     // console.log(dfaulterData[0]._id.toString());
//     // If user_id is already present, update CIBIL score or take other actions
//     // await DefaulterSchema.findByIdAndUpdate(
//     //     { _id: defaulterData[0]._id.toString() },
//     //     { $inc: { cibil_score: -10 } }, // Decrease CIBIL score
//     //     { new: true }
//     // );

//     // return res.status(200).json({ status: 1, msg: 'CIBIL score decreased due to repeated entry' });

//     // if (!userIdArr.includes(userID)) {
//     //     await DefaulterSchema.findByIdAndUpdate({ _id: defaulterData[0]._id.toString() }, { $push: { [`user_id`]: userID } })
//     // }



//     // res.send("defaluter found");

//     // Validate file uploads
//     // if (!bankStatement) return res.status(400).json({ status: 0, msg: "Please Upload bank Statement" });
//     // if (!otherDocs) return res.status(400).json({ status: 0, msg: "Please Upload Other Document" });

    
// };

// add defaulter by user id 2nd fn 
exports.AddDefaulterByUser = async (req,res)=>{

    try {
        const {
          user_id,
          defaulter_name,
          mobile_No,
          aadhar_card,
          address,
          city,
          state,
          firm_name,
          gst_no,
          pan_card_no,
          pending_amount,
          remark
        } = req.body;

        const userdata=await user_schema.findOne({_id:user_id});
        
        // console.log(userdata);
        const bankStatement = req.files?.bankStatement?.[0]?.filename;
        const otherDocs = req.files?.otherDocs?.[0]?.filename;
    
        // Validate file uploads
        if (!bankStatement) return res.status(400).json({ status: 0, msg: "Please upload bank statement" });
        if (!otherDocs) return res.status(400).json({ status: 0, msg: "Please upload other document" });
    
        const bankpath = '/upload/' + bankStatement;
        const otherDocsPath = '/upload/' + otherDocs;
    
        // Check if the defaulter exists
        const defaulterData = await DefaulterSchema.findOne({ gst_no, pan_card_no });
    
        if (defaulterData) {
          // Defaulter exists; check user_id and update
          const userIdArr = defaulterData.user_id || [];
    
          if (!userIdArr.includes(user_id)) {
            // Push user_id and update cibil_score if user_id is not present
            await DefaulterSchema.findByIdAndUpdate(
              defaulterData._id,
              { 
                $push: { user_id: user_id },
                $inc: { cibil_score: -25 } 
              },
              { new: true }
            );
          }
          return res.status(200).json({ status: 1, msg: "Defaulter updated successfully" });
        } else {
          // Add new defaulter if it doesn't exist
          const currentTime = new Date(); // Current time for added_on field
          const defaulterData = new DefaulterSchema({
            user_id: [user_id],
            defaulter_name,
            mobile_No,
            aadhar_card,
            address,
            city,
            state,
            firm_name,
            gst_no,
            pan_card_no,
            pending_amount,
            remark,
            bankStatement: bankpath,
            otherDocument: otherDocsPath,
            added_by: userdata.user_name || "System", // Assuming you have `req.user`
            added_on: currentTime,
            added_on1: currentTime
          });
    
          const defaulterResponseData = await defaulterData.save();
    
          return res.status(200).json({ status: 1, msg: "Defaulter added successfully", data: defaulterResponseData });
        }
      } catch (error) {
        console.error("Error adding defaulter:", error);
        return res.status(500).json({ status: 0, msg: "Internal Server Error", error: error.message });
      }
   

}


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




















// try {
    //     const defaulterData = new DefaulterSchema({user_id, defaulter_name, mobile_No, aadhar_card, address, city, state, firm_name, gst_no, pan_card_no, pending_amount: pending_amount, remark, bankStatement: bankpath, otherDocument: otherDocsPath , added_by :userallData.user_name , added_on : currentTime
    //     });
    //     const defaulterResponseData = await defaulterData.save();
    //     // Response after successful save
    //     return res.status(200).json({status:1, msg: 'Defaulter added successfully', data: defaulterResponseData });
    // } catch (error) {
    //     console.error('Error adding defaulter:', error);
    //     if (error.errors.aadhar_card.valueType == "string") {
    //         return res.status(409).json({ status: 0, msg: 'Please Enter Valid aadhar card ' });
    //     }
    //     return res.status(500).json({ msg: 'Error adding defaulter' });
    // }