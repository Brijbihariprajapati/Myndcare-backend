const express = require('express');
const authcontrollers = require('../Controllers/auth-controllers');
const authenticateJWT = require('../middleware/authenticateJWT');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./public/adminimage'); 
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`); 
    }
});

const upload = multer({ storage });

router.route('/').post(upload.single('image'), authcontrollers.home);

router.route('/login').post(authcontrollers.login);

router.route('/dashboard').get(authenticateJWT, (req, res) => {
    res.json({ msg: `Welcome to your dashboard, user: ${req.user.email}` });
  });
router.route('/setting').get(authenticateJWT, (req, res) => {
    res.json({ msg: `Welcome to your setting, user: ${req.user.email}` });
  });
router.route('/usermanagement').get(authenticateJWT, (req, res) => {
    res.json({ msg: `Welcome to your usermanagement, user: ${req.user.email}` });
  });
  router.route('/profile').get(authenticateJWT, (req, res) => {
    res.json({ msg: `Welcome to User Profile, user: ${req.user.email}` });
  });
  router.route('/question').get(authenticateJWT,(req,res)=>{
    res.json({msg:`welcome to your createquestion, user: ${req.user.email}`})
  })
 router.route('/home').get(authenticateJWT,(req,resp)=>{
  resp.json({msg:`Weelcome to home page, user: ${req.user.email}`})
 })
 router.route('/userabout').get(authenticateJWT,(req,resp)=>{
  resp.json({msg:`Welcome to about page, user: ${req.user.email}`})
 })
 router.route('/admin/questions').get(authenticateJWT,(req,resp)=>{
  resp.json({msg:`Welcome to questions page, user: ${req.user.email}`})
 })
 router.route('/usercontact').get(authenticateJWT,(req,resp)=>{
  resp.json({msg:`welcome to contact form, user: ${req.user.email}`})
 })
 router.route('/contactus').get(authenticateJWT,(req,resp)=>{
  resp.json({msg:`Welcome to contact us page, user: ${req.user.email}`})
 })
 router.route('/replyauth').get(authenticateJWT,(req,resp)=>{
  resp.json({msg:`welcome to reply page, user: ${req.user.email}`})
 })
 router.route('/updatevideoauth').get(authenticateJWT,(req,resp)=>{
  resp.json({msg:`welcome to updatevideo page, user: ${req.user.email}`})
 })
 router.route('/videomanagerauth').get(authenticateJWT,(req,resp)=>{
  resp.json({msg:`welcome to video manager page, user: ${req.user.email}`})
 })
 router.route('/uploadvideoauth').get(authenticateJWT,(req,resp)=>{
  resp.json({msg:`welcome to upload video page, user: ${req.user.email}`})
 })
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<User Apis>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const storagee = multer.diskStorage({destination:function(req,file,cb){
      cb(null,'./public/image')
},
filename:function(req,file,cb){
  cb(null,`${Date.now()}${file.originalname}`)
}
})

const uploadd = multer({storage: storagee })

router.route('/userregister').post(uploadd.single('image'),authcontrollers.userRegister)
router.route('/userlogin').post(authcontrollers.UserLogin)
router.route('/userdata').get(authcontrollers.UserData)
router.route('/userstatus/:id').put(authcontrollers.UserStatus)
router.route('/userdelete/:id').delete(authcontrollers.UserDelete)
router.route('/userdatabyid/:id').get(authcontrollers.UserDataById)
router.route('/createquestion').post(authcontrollers.createQuestion)
router.route('/findquestion').get(authcontrollers.findQuestion)
router.route('/submitquestion').post(authcontrollers.SubmitQuestion)
router.route('/activeuser').get(authcontrollers.activeuser)
router.route('/deactivateuser').get(authcontrollers.deactiveuser)
router.route('/findallquestions').get(authcontrollers.findAllQuestion)
router.route('/contact').post(authcontrollers.contact)
router.route('/findcontactus').get(authcontrollers.getContactUS)
router.route('/reply').post(authcontrollers.ReplyMessage)
router.route('/deletequestion/:id').delete(authcontrollers.deleteQuestion)
router.route('/editquestions/:id').put(authcontrollers.EditQuestion)


const storages = multer.diskStorage({destination:function(req,resp,cb){
  cb(null,'./public/video')
},filename:function(req,file,cb){
  cb(null,`${Date.now()}_${file.originalname}`)
}})

const uploads = multer({storage:storages})

router.route('/video').post(uploads.single('video'),authcontrollers.uploadVideo)
router.route('/findvideo').get(authcontrollers.findvideo)
router.route('/deletevideo/:id').delete(authcontrollers.DeleteVideo)
router.route('/activedeactive/:id').put(authcontrollers.changeStatus)
router.route('/updatevideo/:id').put(authcontrollers.UpdateVideo)




router.route('/findmessage').post(authcontrollers.findMessage)


module.exports = router;
