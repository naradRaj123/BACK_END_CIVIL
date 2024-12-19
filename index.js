require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');

const allroutes=require('./App/index');
app.use(cors());
app.use(express.json());

app.use(allroutes);
app.use("/upload",express.static('upload'));
app.use("/user-img",express.static('user-img'));

// Start the server
const PORT = process.env.PORT || 8000;
// console.log(`Server is running on port ${PORT}`);
// console.log(`Database Connect sucessfully`);
// app.listen(`${PORT}`);
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
        console.log(`Server is running on port ${PORT}`);
        console.log(`Database Connect sucessfully`);
        app.listen(`${PORT}`);
})

