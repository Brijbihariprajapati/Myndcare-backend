const Admin = require("../Models/admin_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema");
const Question = require("../Models/QuestionSchema");
const Contact = require("../Models/contactSchema");
const nodemailer = require("nodemailer");
const Videos = require("../Models/VideoSchema");
const { response } = require("express");
const message = require("../Models/messageSchema");

const home = async (req, resp) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file;

    const userexist = await Admin.findOne({ email: email });
    if (userexist) {
      return resp.status(400).json({ msg: "email already exists" });
    } else {
      const saltround = 10;
      const hashedpassword = await bcrypt.hash(password, saltround);
      const create = await Admin.create({
        name,
        email,
        password: hashedpassword,
        image: image ? image.filename : null,
      });
      resp.status(200).json({ msg: create });
      console.log(create);
    }
  } catch (error) {
    console.log(error);
    resp.status(500).json({ msg: "Server error" });
  }
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Login>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const login = async (req, resp) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const data = await Admin.findOne({ email });
    if (!data) {
      return resp.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) {
      return resp.status(400).json({ msg: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: data._id, email: data.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    resp.status(200).json({ msg: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    resp
      .status(500)
      .json({ msg: "An error occurred during login. Please try again later." });
  }
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<for user>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const userRegister = async (req, resp) => {
  try {
    const { name, email, password, status } = req.body;
    const image = req.file;

    const UserExist = await User.findOne({ email: email });
    if (UserExist) {
      return resp.status(400).json({ msg: "User Already Exist" });
    }
    const saltround = 10;
    const hashedpassword = await bcrypt.hash(password, saltround);
    const val = await User.create({
      name,
      email,
      status,
      password: hashedpassword,
      image: image ? image.filename : null,
    });
    resp.status(200).json({ msg: "Register Succesfull" });
    console.log("resgister user", val);
  } catch (error) {
    console.log("Register Failed", error);
    resp.status(500).json({ msg: "Failed To Register" });
  }
};

const UserLogin = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email });

    if (!user || user.status === 1) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ msg: "Login successful", token });
  } catch (error) {
    console.log("Login failed", error);
    res.status(500).json({ msg: "Login failed", error });
  }
};
const UserData = async (req, resp) => {
  try {
    const data = await User.find();
    if (data) {
      resp.status(200).json(data);
    }
  } catch (error) {
    resp.status(400).json({ msg: "Failed to get userdata" });
    console.log("Failed to get user data", error);
  }
};

const UserStatus = async (req, resp) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    const data = await User.findOneAndUpdate(
      { _id: id },
      { $set: { status: status } },
      { new: true }
    );

    if (data) {
      resp.status(200).send({ message: "Status Updated Successfully", data });
      console.log("Update status successfully");
    } else {
      resp.status(400).json({ msg: "User not found" });
    }
  } catch (error) {
    resp.status(500).json({ msg: "Failed to update status", error });
    console.log("Failed To update Status", error);
  }
};

const UserDelete = async (req, resp) => {
  try {
    const id = req.params.id.toString();
    console.log(id);

    const DeleteUser = await User.deleteOne({ _id: id });
    if (DeleteUser) {
      resp.status(200).json({ msg: "User Delete Succesfully", DeleteUser });
      console.log("User Delete Succesfully", DeleteUser);
    }
  } catch (error) {
    resp.status(400).json({ msg: "Failed To Delete User", error });
    console.log("failed to delete user", error);
  }
};

const UserDataById = async (req, resp) => {
  try {
    const id = req.params.id;
    const data = await User.findById({ _id: id });
    resp.status(200).send(data);
    console.log("find data succesfully");
  } catch (error) {
    resp.status(400).json({ msg: "Failed to find data", error });
    console.log("failed to find data", error);
  }
};

const createQuestion = async (req, resp) => {
  const { question, options, correctOption } = req.body;
  if (!question || !options || correctOption === null) {
    return resp.status(400).json({ msg: "All fields are required" });
  }

  const newQuestion = new Question({
    question,
    options,
    correctOption,
  });

  try {
    await newQuestion.save();
    resp.status(200).json({ msg: "Question created successfully" });
    console.log("Question created successfully");
  } catch (error) {
    resp.status(500).json({ message: "Error creating question", error });
    console.error("Error creating question:", error);
  }
};

const findQuestion = async (req, resp) => {
  try {
    const data = await Question.aggregate([{ $sample: { size: 10 } }]);
    resp.status(200).json(data);
    console.log("find question seccesfully", data);
  } catch (error) {
    resp.status(400).json({ msg: "Failed to find question", error });
    console.log("failed to find questin", error);
  }
};
const findAllQuestion = async (req, resp) => {
  try {
    const data = await Question.find();
    resp.status(200).json(data);
    console.log("find question seccesfully", data);
  } catch (error) {
    resp.status(400).json({ msg: "Failed to find question", error });
    console.log("failed to find questin", error);
  }
};

const SubmitQuestion = async (req, res) => {
  const { userAnswers } = req.body;
  console.log(userAnswers);

  let score = 0;

  try {
    const questions = await Question.find();

    userAnswers.forEach((userAnswer) => {
      const question = questions.find(
        (q) => q._id.toString() === userAnswer.questionId
      );
      console.log("e", question.correctOption, question._id);

      if (question && userAnswer.selectedOption == question.correctOption) {
        score += 1;
      }
    });

    const percentage = (score * 100) / userAnswers.length;
    console.log("percentage", percentage);

    res
      .status(200)
      .json({ msg: "Test submitted successfully", score, percentage });
    console.log("Test submitted successfully", score);
  } catch (error) {
    res.status(500).json({ msg: "Test not submitted", error });
    console.log("Test not submitted", error);
  }
};

const activeuser = async (req, resp) => {
  try {
    const data = await User.find({ status: "0" });
    resp.status(200).json(data);
  } catch (error) {
    resp.status(400).json({ msg: "failed to get active users data", error });
  }
};
const deactiveuser = async (req, resp) => {
  try {
    const data = await User.find({ status: "1" });
    resp.status(200).json(data);
  } catch (error) {
    resp.status(200).json({ msg: "failed to find deactive users", error });
  }
};



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<contact from>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const contact = async(req,resp)=>{
  try {
    const message = req.body
    const data = await Contact.create(message)
    if(data){
      resp.status(200).json({mssg:'message send succesfully',data})
      console.log('message send succesfully',data);
      
    }
  } catch (error) {
    resp.status(400).json({msg:'failed send message',error})
    console.log('Failed to send message', error);
    
    
  }
}
const getContactUS = async (req,resp)=>{
  try {
    const data = await Contact.find()
    if(data){
      resp.status(200).json(data)
      console.log('Succesfull find contact us message');
      
    }
  } catch (error) {
    resp.status(200).json({msg:'Failed to find contact us message ', error})
    console.log('failed to find contact us message ',error);
    
  }
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const ReplyMessage = async (req,resp) =>{
  try {
    const {email,reply,Name} = req.body
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your Message",
      text: `Hello ${Name} thanks for contact to me ${reply} .`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error.message);
        return resp.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        return resp.json({ message: "Message sent successfully" });
      }
    });
  } catch (error) {
    resp.status(400).json({msg:'failed to send message',error})
    console.log('failed to sent message',error);
    
  }
}

const deleteQuestion = async (req,resp) => {
  try {
    const id = req.params.id
    const data = await Question.deleteOne({_id:id})
    if(data){
      resp.status(200).json({msg:'question Delete Succesfully'})
      console.log('question Delete Succesfully');
      
    }
  } catch (error) {
    resp.status(400).json({msg:'Failed to Delete Question'})
    console.log('failed to delete question');
    
  }
}
const EditQuestion = async (req,resp)=>{
  try {
    const id = req.params.id
    const data  =req.body
    console.log(id,data);
    const response = await Question.findByIdAndUpdate(id,data,{new:true})
    resp.status(200).json({msg:'Succesfully Update',response})
    console.log(response);

    
  } catch (error) {
    resp.status(400).json('Failed to update')
  }
}


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Video Section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const uploadVideo = async (req, resp)=>{
  try {

    const {title,scores} = req.body
    const video = req.file

    console.log('title',title);
    console.log(video);
    
    
    const response = await Videos.create({video:video?video.filename:null,title,scores})
    if(response){
      resp.status(200).json({msg:'video uploaded succesfully',response})
      console.log('video uploaded succesfully',response);
      
    }
  } catch (error) {
    resp.status(400).json({msg:'Failed to upload video',error})
    console.log('failed to upload video',error);
    
  }
}

const findvideo = async (req,resp)=>{
  try {
    const response = await Videos.find()
    if(response ){
      resp.status(200).json({msg:'Video fetched succesfully',response})
      console.log('video fetched succesfullly');
      
    }
  } catch (error) {
    resp.status(400).json({msg:'failed to fetch video',error})
    console.log('failed to fetch video',error);
    
  }
}
const DeleteVideo = async (req,resp)=>{
  try {
    const id = req.params.id
    const response = await Videos.findByIdAndDelete(id)
    if(response){
      resp.status(200).json({msg:'Video Deleted Succesfully'})
      console.log('video deleted succesfully');
      
    }
  } catch (error) {
    resp.status(400).json({msg:'failed to delete video',error})
    log('failed to delete video',error)
  }
}
const changeStatus = async (req,resp)=>{
  try {
    const id = req.params.id
    const Status= await Videos.findById(id)
    if(Status.status ==0){
     const  updatedata = {status:1}
       await Videos.findByIdAndUpdate({_id:id},{$set:updatedata})
      resp.status(200).json({msg:'Succesfully Update Status'})
      console.log('Succesfully Update Status');

    }else{
      const UpdateData = {status:0}
      await Videos.findByIdAndUpdate({_id:id},{$set:UpdateData})
      resp.status(200).json({msg:'Succesfully Update Status'})
      console.log('Succesfully Update Status');
      
    }
  } catch (error) {
    resp.status(400).json({msg:'Failed To Update Status',error})
    console.log('Failed To Update Status',error);
    
  }
}
const UpdateVideo = async(req,resp)=>{
  try {
    const id = req.params.id
    const {title,scores,status} = req.body
    const videostatus = await Videos.findById(id)
    if(!videostatus){
      resp.status(400).json({msg:'Video is not exist'})
    }else{
      const response = await Videos.findByIdAndUpdate({_id:id},{$set:{title:title,scores:scores,status:status}})
     if(response){
      resp.status(200).json({msg:'Video Update Succesfully'})
      console.log('Video Update Succesfully',response);
     }
      
    }
  } catch (error) {
    resp.status(400).json({msg:'failed to update video',error})
    console.log('Failed to update video',error);
    
  }
}
const findMessage = async (req, resp) => {
  try {
    const { recipientEmail, senderEmail } = req.body;
    console.log("Recipient:", recipientEmail, "Sender:", senderEmail);

    const messages = await message.find({
      $or: [
        { senderEmail: senderEmail, recipientEmail: recipientEmail },
        { senderEmail: recipientEmail, recipientEmail: senderEmail },
      ],
    });

    if (messages.length > 0) {
      resp.status(200).json(messages);
    } else {
      resp.status(404).json({ message: "No messages found." });
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    resp
      .status(500)
      .json({ error: "An error occurred while fetching messages." });
  }
};
module.exports = {
  home,
  login,
  userRegister,
  UserLogin,
  UserData,
  UserStatus,
  UserDelete,
  UserDataById,
  createQuestion,
  findQuestion,
  SubmitQuestion,
  activeuser,
  deactiveuser,
  findAllQuestion,
  contact,
  getContactUS,
  ReplyMessage,
  deleteQuestion,
  EditQuestion,
  uploadVideo,
  findvideo,
  DeleteVideo,
  changeStatus,
  UpdateVideo,
  findMessage
};
