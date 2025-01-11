require('dotenv').config();
const DefaulterSchema = require('../../modal/Defaulter');
const fs = require('fs');
const user_schema = require('../../modal/UserModal');
const { default: mongoose } = require('mongoose');


// add defaulter by user id 2nd fn working done fn dublicate 
// exports.AddDefaulterByUser = async (req,res)=>{
//     try {
//         const {
//           user_id,
//           defaulter_name,
//           mobile_No,
//           aadhar_card,
//           address,
//           city,
//           state,
//           firm_name,
//           gst_no,
//           pan_card_no,
//           pending_amount,
//           remark,
//           country
//         } = req.body;

//         // user data by user id
//         const userdata=await user_schema.findOne({_id:user_id});
//         if(userdata==null) return res.send("user id not valid");
        
//         console.log(userdata.user_name);
        
//         const bankStatement = req.files?.bankStatement?.[0]?.filename;
//         const otherDocs = req.files?.otherDocs?.[0]?.filename;

//         // Validate file uploads
//         if (!bankStatement) return res.status(400).json({ status: 0, msg: "Please upload bank statement" });
//         // if (!otherDocs) return res.status(400).json({ status: 0, msg: "Please upload other document" });

//         const bankpath = '/upload/' + bankStatement;
//         const otherDocsPath = '/upload/' + otherDocs;

//         // Check if the defaulter exists
//         const defaulterData = await DefaulterSchema.findOne({ gst_no, pan_card_no });

//         console.log(defaulterData);

//         if (defaulterData) {
//           // Defaulter exists; check user_id and update
//           const userIdArr = defaulterData.user_id || [{}];
//           console.log(userIdArr)
//           console.log((!userIdArr.includes(user_id)))
//           if (!userIdArr.includes(user_id)) {
//             // Push user_id and update cibil_score if user_id is not present
//             await DefaulterSchema.findByIdAndUpdate(
//               defaulterData._id,
//               { 
//                 $push: { user_id: user_id , added_by: userdata.firm_name },
//                 $inc: { cibil_score: -25 } 
//               },
//               { new: true }
//             );
//           }
//           return res.status(200).json({ status: 1, msg: "Defaulter updated successfully" });
//         } else {
//           // Add new defaulter if it doesn't exist
//           const currentTime = new Date(); // Current time for added_on field
//           const defaulterData = new DefaulterSchema({
//             user_id: [user_id],
//             defaulter_name,
//             mobile_No,
//             aadhar_card,
//             address,
//             city,
//             state,
//             firm_name,
//             gst_no,
//             pan_card_no,
//             pending_amount,
//             remark,
//             country,
//             bankStatement: bankpath,
//             otherDocument: otherDocsPath,
//             added_by:[userdata.user_name] , // Assuming you have `req.user`
//             added_on: currentTime,
//             added_on1: currentTime
//           });

//           const defaulterResponseData = await defaulterData.save();

//           return res.status(200).json({ status: 1, msg: "Defaulter added successfully", data: defaulterResponseData });
//         }
//       } catch (error) {
//         console.error("Error adding defaulter:", error);
//         return res.status(500).json({ status: 0, msg: "Internal Server Error", error: error.message });
//       }


// }


// add defaluter by user fn 2n working done
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
          remark,
          country
        } = req.body;
        // user data by user id
        const userdata=await user_schema.findOne({_id:user_id});
        if(userdata==null) return res.send("user id not valid");
        
        const firmNameofUser=userdata.firm_name;

        const bankStatement = req.files?.bankStatement?.[0]?.filename;
        const otherDocs = req.files?.otherDocs?.[0]?.filename;

        // Validate file uploads
        if (!bankStatement) return res.status(400).json({ status: 0, msg: "Please upload bank statement" });
        // if (!otherDocs) return res.status(400).json({ status: 0, msg: "Please upload other document" });

        const bankpath = 'upload/' + bankStatement;
        const otherDocsPath = 'upload/' + otherDocs;

        // Check if the defaulter exists
        // const defaulterData = await DefaulterSchema.findOne({ gst_no, pan_card_no });
        const defaulterData = await DefaulterSchema.findOne({ $or: [{ gst_no: gst_no }, { pan_card_no: pan_card_no }] });

        if (defaulterData) {
          // Defaulter exists; check user_id and update
          const userIdArr = defaulterData.user_id || [{}];
          
          if (!userIdArr.includes(user_id)) {
            // Push user_id and update cibil_score if user_id is not present

            if(defaulterData.cibil_score > 75 || defaulterData.cibil_score >= 50  ){
            await DefaulterSchema.findByIdAndUpdate(
              defaulterData._id,{ 
                $push: { user_id: user_id , added_by: userdata.firmNameofUser },$inc: { cibil_score: -25 } 
              },{ new: true }
            );
          }else{
            await DefaulterSchema.findByIdAndUpdate(
              defaulterData._id,{ 
                $push: { user_id: user_id , added_by: userdata.firmNameofUser },},{ new: true }
            );
          }
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
            country,
            bankStatement: bankpath,
            otherDocument: otherDocsPath,
            added_by:[firmNameofUser] , // Assuming you have `req.user`
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

// exports.AddDefaulterByUser = async (req, res) => {
//   try {
//     const {
//       // user_id,
//       defaulter_name,
//       mobile_No,
//       aadhar_card,
//       address,
//       city,
//       state,
//       firm_name,
//       gst_no,
//       pan_card_no,
//       pending_amount,
//       remark,
//       country
//     } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(req.body.user_id[0].id)) {
//       return res.status(400).json({ error: "Invalid ObjectId in user_id." });
//     }
//     console.log(req.body.user_id[0].id)
//     const userId = req.body.user_id[0].id;

//     // Find the user
//     const userdata = await user_schema.findOne({ _id: userId });
//     if (userdata == null) return res.status(400).send("User ID is not valid");

//     console.log(userdata._id.toString());

//     // Handle file uploads
//     const bankStatement = req.files?.bankStatement?.[0]?.filename;
//     const otherDocs = req.files?.otherDocs?.[0]?.filename;

//     const bankpath = '/upload/' + bankStatement;
//     const otherDocsPath = '/upload/' + otherDocs;

//     // // Check if the defaulter exists
//     const defaulterData = await DefaulterSchema.findOne({ gst_no, pan_card_no });
//     console.log(defaulterData.user_id.length);

//     const userIdArr = defaulterData.user_id.map(user => user.id);
    

//     //// check user already exits
//   //   if(!userIdArr.includes(user_id)){
//   //   // Push new user_id object if not present
//   //   await DefaulterSchema.findByIdAndUpdate(
//   //     defaulterData._id,
//   //     { 
//   //       $push: { user_id: { id: userdata._id.toString(), added_by: userdata.user_name } },
//   //       $inc: { cibil_score: -25 }
//   //     },
//   //     { new: true }
//   //   );
//   // }

   
//     // res.send("this is done");
//     if (defaulterData) {
      
        
       

//       return res.status(200).json({ status: 1, msg: "Defaulter updated successfully" });
//     } 
//     else {
//       // Add new defaulter if it doesn't exist
//       const currentTime = new Date(); // Current time for added_on field
//       const defaulterData = new DefaulterSchema({
//         user_id: req.body.user_id.map((user) => ({
//           id: user.id,
//           added_by: user.added_by,
//         })),
//         defaulter_name,
//         mobile_No,
//         aadhar_card,
//         address,
//         city,
//         state,
//         firm_name,
//         gst_no,
//         pan_card_no,
//         pending_amount,
//         remark,
//         country,
//         bankStatement: bankpath,
//         otherDocument: otherDocsPath,
//         // added_by: [userdata.firm_name],
//         // added_on: currentTime,
//         // added_on1: currentTime
//       });

//       const defaulterResponseData = await defaulterData.save();
//       return res.status(200).json({ status: 1, msg: "Defaulter added successfully" });
//     }
//   } catch (error) {
//     console.error("Error adding defaulter:", error);
//     return res.status(500).json({ status: 0, msg: "Internal Server Error", error: error.message });
//   }
// };



// exports.AddDefaulterByUser = async (req, res) => {
//   try {
//     const {
//       user_id,
//       defaulter_name,
//       mobile_No,
//       aadhar_card,
//       address,
//       city,
//       state,
//       firm_name,
//       gst_no,
//       pan_card_no,
//       pending_amount,
//       remark,
//       country,
//     } = req.body;

//     // Find user data by user_id
//     const userdata = await user_schema.findOne({ _id: user_id });

//     if (!userdata) return res.status(400).json({ status: 0, msg: "User ID is not valid" });

//     const bankStatement = req.files?.bankStatement?.[0]?.filename;
//     const otherDocs = req.files?.otherDocs?.[0]?.filename;

//     // const bankpath = bankStatement ? '/upload/' + bankStatement : null;
//     // const otherDocsPath = otherDocs ? '/upload/' + otherDocs : null;

//     // Check if the defaulter exists
//     const defaulterData = await DefaulterSchema.findOne({ gst_no, pan_card_no });

//     if (defaulterData) {
//       // Defaulter exists; check if user_id already exists in the user_id array
//       const userExists = defaulterData.user_id.some((user) => user.id === user_id);

//       console.log(userExists);

//       if (!userExists) {
//         // Push new user_id object to the array and update cibil_score
//         await DefaulterSchema.findByIdAndUpdate(
//           defaulterData._id,
//           {
//             $push: {
//               user_id: {
//                 id: user_id,
//                 added_by: userdata.user_name || userdata.firm_name,
//                 date_added: new Date(),
//               },
//             },
//             $inc: { cibil_score: -25 },
//           },
//           { new: true }
//         );
//       }

//       return res.status(200).json({ status: 1, msg: "Defaulter updated successfully" });
//     } else {
//       // Add new defaulter if it doesn't exist
//       const currentTime = new Date(); // Current time for added_on field
//       const defaulterData = new DefaulterSchema({
//         user_id: [
//           {
//             id: user_id,
//             added_by: userdata.user_name || userdata.firm_name,
//             date_added: currentTime,
//           },
//         ],
//         defaulter_name,
//         mobile_No,
//         aadhar_card,
//         address,
//         city,
//         state,
//         firm_name,
//         gst_no,
//         pan_card_no,
//         pending_amount,
//         remark,
//         country,
//         bankStatement: bankpath,
//         otherDocument: otherDocsPath,
//         added_by: [userdata.firm_name || "System"],
//         added_on: currentTime,
//       });

//       const defaulterResponseData = await defaulterData.save();

//       return res
//         .status(200)
//         .json({ status: 1, msg: "Defaulter added successfully", data: defaulterResponseData });
//     }
//   } catch (error) {
//     console.error("Error adding defaulter:", error);
//     return res.status(500).json({ status: 0, msg: "Internal Server Error", error: error.message });
//   }
// };



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
      return res.status(200).json({ status: 1, data: DefaulterData });
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
  
  if (!user_id) return res.status(400).json({ status: 0, Message: "user  id not found !" }) ;
  if (!defaulter_id) return res.status(400).json({ status: 0, Message: "Defaulter  Id Not found" }) ;

  try {

    // get defaluter data 
    const defaulterData=await DefaulterSchema.findById({_id:defaulter_id.toString()});
    
    // check user id match in defaulter list
    if(!defaulterData.user_id.includes(user_id)){
        return res.send({status:0,Message:"No match found. User score remains unchanged."})
    }

    const defaulterDataInUserId=defaulterData.user_id;
  
    for (const [index, value] of defaulterDataInUserId.entries()) {
      if (value === user_id) {
        if(100 < defaulterData.cibil_score){
         const result = await DefaulterSchema.findByIdAndUpdate({ _id: defaulterData._id }, 
            { 
              $set: { cibil_score: defaulterData.cibil_score + 25 } ,
              $pull:{user_id:user_id}
          });
          if(result) return res.send({status:200,Messasge:"successfully  clear score !"})
        }else{
         const result2= await DefaulterSchema.findByIdAndUpdate({ _id: defaulterData._id }, 
            { 
              $pull:{user_id:user_id}
          });
          if(result2) return res.send({status:200,Messasge:"successfully  clear score !"})
        }
      }
  }
    
  } catch (error) {
    return res.send({status:0,Message:"Something went to wrong please try sometime"});  
  }


  
 

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