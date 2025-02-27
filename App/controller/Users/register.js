require('dotenv').config();
const bcrypt = require('bcrypt');
const jwttoken = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const user_schema = require('../../modal/UserModal');
const fs = require('fs');
const { reset } = require('nodemon');

// HOME PAGE API
exports.homepage = async (req, res) => {
    res.send("Welcome to Home routes");
}

// USER REGISTER API
exports.userRegister = async (req, res) => {
    const { gst_no, pan_no, firm_name, user_name, mobile_no, email, password ,business_type ,country,state,address , city } = req.body;
    if (gst_no == "" || firm_name == "" || user_name == "" || mobile_no == "" || email == "" || password == "") {
        return res.status(409).json({ status: 0, msg: 'All field are Required' });
    }
    // user email exits 
    const userExits = await user_schema.findOne({ email });
    if (userExits) {
        return res.status(409).json({ status: 0, msg: 'Email already Exists Please Try another email' });
    }
    const salthRound = 10;
    const hashPassword = await bcrypt.hash(password, salthRound);
    try {
        let userData = new user_schema({ gst_no, pan_no, firm_name, user_name, mobile_no, email, password: hashPassword ,business_type ,country , state ,address ,city })
        const userResponse = await userData.save()
            .then((insertdata) => {
                // send mail
                res.status(200).json({ status: 1, msg: `Register successfull` });
            })

    } catch (error) {
        if (error.errorResponse.keyPattern.email) {
            res.status(409).json({ status: 0, msg: 'Email already Exists Please Try another email' });
        }
        return res.status(409).json({ status: 0, msg: 'Registration fail something went wrong' });

    }
}


// LIST OF USER
exports.ListofUsers = async (req, res) => {
    try {
        const userdata = await user_schema.find();
        if (userdata.length > 0) {
            return res.status(200).json({ status: 1, userdata })
        } else {
            return res.status(200).json({ status: 0, msg: "user not found" })
        }
    } catch (error) {
        return res.status(404).json({ status: 0, msg: "something went to wrong Please try again" })
    }
}

// USER LOGIN API
exports.LoginUser = async (req, res) => {
    const { email, password } = req.body;
    if (email == "") { return res.status(404).json({ status: 0, msg: "Email required" }); }
    if (password == "") { return res.status(404).json({ status: 0, msg: "Password required" }); }
    try {
        const userData = await user_schema.findOne({ email });
        if (userData == null) { return res.status(404).json({ status: 0, msg: "user not found" }) }
        const matchPassword = await bcrypt.compare(password, userData.password);
        if (!matchPassword) { return res.status(401).json({ status: 0, msg: "password not match" }) }
        const userToken = await jwttoken.sign({ id: userData._id }, process.env.JWT_TOKEN_KEY)
        return res.status(200).json({ status: 1, msg: "login successful", userData, token_key: userToken })
    } catch (error) {
        return res.status(500).json({ status: false, msg: "Something went Wrong try Sometime" });
    }

}


// user data by user id
exports.UserInfoById = async (req, res) => {
    const userId = req.params.id;
    try {
        const userData = await user_schema.findById({ _id: userId })
        if (!userData) {
            return res.status(404).json({ status: false, msg: "user not found. please check the id.", });
        }
        return res.status(200).json({ status: 1, userData, staticPath: "https://back-end-civil.onrender.com/" });
    } catch (error) {
        if (error?.kind === 'ObjectId') {
            return res.status(400).json({ status: false, msg: "Invalid user ID format. Please check the ID.", });
        }
        // Handle generic server error
        return res.status(500).json({ status: false, msg: "An unexpected error occurred. Please try again later.", });
    }
}


// user edit by id 
exports.EditByUserId = async (req, res) => {
    const { user_id, user_name, gst_no, pan_no, firm_name, mobile_no , address,city,state } = req.body;
    const updateData = {};
    if (user_name) updateData.user_name = user_name;
    if (gst_no) updateData.gst_no = gst_no;
    if (pan_no) updateData.pan_no = pan_no;
    if (firm_name) updateData.firm_name = firm_name;
    if (mobile_no) updateData.mobile_no = mobile_no;
        updateData.address=address;
        updateData.state=state;
        updateData.city=city;
    const result = await user_schema.updateOne(
        { _id: user_id }, // Query to match the document
        { $set: updateData } // Update operation
    );
    if (result) {
        return res.status(200).json({ status: 1, msg: "Update Sucessfully" })
    } else {
        return res.status(500).json({ status: false, msg: "Update Failed " })
    }
}


// user forgot password
exports.ForgotPassword = async (req, res) => {
    // res.send("forgot password controller")
    const { email } = req.body;
    if (!email) {
        return res.status(404).json({ status: false, msg: "Enter Your email" });
    }
    try {
        const emailData = await user_schema.findOne({ email });
        if (!emailData) {
            return res.status(409).json({ status: 0, msg: "email not found" })
        }
        const currentDateTime = new Date();
        const futureTime = new Date(currentDateTime.getTime() + 1 * 60 * 1000)

        const expirytime = futureTime.toLocaleString();
        // send mail when user email found 
        const otp = Math.floor(1111 + Math.random() * (9999 - 1111 + 1));

        // update data in user schema
        const userData = await user_schema.updateOne({ _id: emailData._id.toString() }, { $set: { otp_expiry: futureTime, otp: otp } })
        if (userData) {
            const transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,// true for 465,
                requireTLS: true, // in case server doesn't support
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
            });
            const mailSend = transporter.sendMail({
                from: process.env.EMAIL_USER, // sender address
                to: `${email}`, // list of receivers
                subject: "Verification Otp", // Subject line
                text: `Your Otp is :${otp} `, // plain text body
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; padding: 20px;">
                        <h2 style="text-align: center; color: #4CAF50;">Verification OTP</h2>
                        <p>Dear User,</p>
                        <p>We received a request to verify your ${email}. Use the OTP below to complete the verification process:</p>
                        <p>Your Otp expiry ${expirytime} </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; background: #f9f9f9; padding: 10px 20px; border: 1px solid #eaeaea; border-radius: 5px;">
                                ${otp}
                            </span>
                        </div>
                        <p>If you did not make this request, please ignore this email.</p>
                        <p>Thank you,<br>Your Company Team</p>
                    </div>
                </div>  `, // html body
            });

            if (mailSend) {
                return res.status(200).json({ status: true, msg: `successful send otp on your email : ${email} ` });
            }
        }

    } catch (error) {
        return res.status().json({ status: false, msg: "Something went to wrong" });
    }

}


// VERIFY OTP FUNCTION 
exports.verifyOtp = async (req, res) => {
    let { email, otp } = req.body;
    if (!otp) {
        return res.status(404).json({ status: 0, msg: "Please Enter Otp" })
    }
    if (!email) {
        return res.status(404).json({ status: 0, msg: "Please Enter Email" })
    }
    const userdata = await user_schema.findOne({ email })
    const currentDateTime = new Date();
    const expiryTime = new Date(userdata.otp_expiry);
    if (userdata) {
        // console.log(userdata.otp)
        if (otp === userdata.otp) {
            if (currentDateTime <= expiryTime) {
                return res.send({ status: 200, msg: "OTP Verify Successful" });
            } else {
                // return res.status(408).json({status:0,msg:"Otp Expire"})
                return res.send({ status: 408, msg: "Otp Expire" })
            }
        } else {
            // return res.status(400).json({status:0,msg:"Invalid OTP"})
            return res.send({ status: false, msg: "Invalid OTP" })
        }
    }
}


// RESEND OTP FUNCTION
exports.ResendOtp = async (req, res) => {

    const { email } = req.body;
    if (!email) {
        return res.status(404).json({ status: false, msg: "Enter Your email" });
    }
    try {
        const emailData = await user_schema.findOne({ email });
        if (!emailData) {
            return res.status(409).json({ status: 0, msg: "email not found" })
        }
        const currentDateTime = new Date();
        const futureTime = new Date(currentDateTime.getTime() + 1 * 60 * 1000)

        const expirytime = futureTime.toLocaleString();
        // send mail when user email found 
        const otp = Math.floor(1111 + Math.random() * (9999 - 1111 + 1));

        // update data in user schema
        const userData = await user_schema.updateOne({ _id: emailData._id.toString() }, { $set: { otp_expiry: futureTime, otp: otp } })
        if (userData) {
            const transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,// true for 465,
                requireTLS: true, // in case server doesn't support
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
            });
            const mailSend = transporter.sendMail({
                from: process.env.EMAIL_USER, // sender address
                to: `${email}`, // list of receivers
                subject: "Verification Otp", // Subject line
                text: `Your Otp is :${otp} `, // plain text body
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; padding: 20px;">
                        <h2 style="text-align: center; color: #4CAF50;">Verification OTP</h2>
                        <p>Dear User,</p>
                        <p>We received a request to verify your ${email}. Use the OTP below to complete the verification process:</p>
                        <p>Your Otp expiry ${expirytime} </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; background: #f9f9f9; padding: 10px 20px; border: 1px solid #eaeaea; border-radius: 5px;">
                                ${otp}
                            </span>
                        </div>
                        <p>If you did not make this request, please ignore this email.</p>
                        <p>Thank you,<br>Your Company Team</p>
                    </div>
                </div>  `, // html body
            });

            if (mailSend) {
                return res.status(200).json({ status: true, msg: `successful send otp on your email : ${email} ` });
            }
        }

    } catch (error) {
        return res.status().json({ status: false, msg: "Something went to wrong" });
    }

    // res.send("this is resend otp controller");
}


// CHANGE PASSWORD AFTER 
exports.ChangePassword = async (req, res) => {
    const { email, new_password } = req.body;
    if (!email) { return res.send({ status: 0, msg: "please enter email" }) }
    // check valid email from database
    const userData = await user_schema.findOne({ email });
    if (!userData) { return res.send({ status: 404, msg: "email not found" }) }
    try {
        const salthRound = 10;
        const hashNewPassword = await bcrypt.hash(new_password, salthRound);
        // console.log(hashNewPassword);
        // user update 
        const userUpdateData = await user_schema.updateOne({ _id: userData._id.toString() }, { $set: { password: hashNewPassword } })
        if (userUpdateData) {
            return res.send({ status: 200, msg: "password changed successfully." })
        }

    } catch (error) {
        return res.send({ status: false, msg: "Something went wrong! Please try again." })
    }
}



// user update image by user id
exports.UserImageUdateById = async (req, res) => {
    const user_id = req.params.id;
    const userImgName = req.file?.filename; // Correct for single upload
    console.log(userImgName);
    const imagePath = 'user-img/' + userImgName;

    if (!user_id) {
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Failed to delete image:", err);
            } else {
                console.log("Image deleted due to error in database update");
            }
        });
        return res.status(400).send({ status: false, msg: "Please enter a valid user ID" });
    }
    if (!userImgName) return res.status(400).send({ status: false, msg: "No image file uploaded" });

    try {
        const userData = await user_schema.findOne({ _id: user_id });
        if (!userData) return res.status(404).send({ status: false, msg: "User not found" });

        // check image old image of user
        console.log(userData.user_img === null);
        if (userData.user_img === null) {
            // upload images in database
            const uploadData = await user_schema.findByIdAndUpdate({ _id: user_id }, { $set: { user_img: imagePath } }, { new: true });
            if (!uploadData) return res.status(200).json({ status: 403, msg: "image  uploaded fail!" })
            if (uploadData) return res.status(200).json({ status: 200, msg: "image sucessfully uploaded!" })
        }
        else{
           
            // get user data from database 
            const userAllData=await user_schema.findById({_id:user_id});
    
            // remove image from folder
            const imageOldpath='https://back-end-civil.onrender.com/'+userAllData.user_img;

            fs.unlink(imageOldpath, (err) =>{
                if (err) {
                    console.error("Failed to delete image:", err);
                } else {
                    console.log("Image deleted due to error in database update");
                }
            })

            // when already image exits 
            const uploadData = await user_schema.findByIdAndUpdate({ _id: user_id }, { $set: { user_img: imagePath } }, { new: true });
            if (!uploadData) return res.status(200).json({ status: 403, msg: "image  uploaded fail!" })
            if (uploadData) return res.status(200).json({ status: 200, msg: "image sucessfully uploaded!" })

        }
        // res.send("this is image upload controller");

    } catch (error) {
        // Get the full path of the uploaded file
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Failed to delete image:", err);
            } else {
                console.log("Image deleted due to error in database update");
            }
        });
        return res.status(500).send({ status: false, msg: "Something went wrong. Please try again later." });
    }
};
