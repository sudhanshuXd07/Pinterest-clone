var express = require('express');
var router = express.Router();
const userModel=require('./users');
const postModel = require("./posts"); 
const passport = require('passport');
const upload=require("./multer");
const path = require("path");

const localStrategy=require("passport-local");                            //user login
const { post } = require('../app');
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());                         //user login
passport.deserializeUser(userModel.deserializeUser());
     

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/uploadProfilePic', isLoggedIn, upload.single('profilePic'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const user = await userModel.findOne({ username: req.session.passport.user });


  user.profileImage = req.file.filename; // save filename to DB
  await user.save();

  res.redirect('/profile');
});

router.get('/login',  function(req, res, next) {
  res.render('login',{error: req.flash('error')});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post('/upload', isLoggedIn ,upload.single("file"),async function(req, res, next) {
  if(!req.file){
    return res.status(404).send('no files were uploaded');
  }
  const user= await userModel.findOne({username: req.session.passport.user});
  const post=await postModel.create({
    image:req.file.filename,
    imageText: req.body.filecaption,
    user:user._id
  });
console.log("Uploaded file:", req.file.filename);

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.get('/test-image', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/images/uploads/6a30a0c7-9a1e-4e84-95f4-xxxxxxxxxxxx.jpg'));
});


router.get('/profile', isLoggedIn , async function(req, res, next) {         
  const user=await userModel.findOne({ 
    username: req.session.passport.user                                        // user data uploaded when he logged in
  })
  .populate("posts");
   res.render("profile",{user});
});

router.post("/register",function(req,res){
  const { username, email, fullname } = req.body;
const userData = new userModel({ username, email, fullname });

userModel.register(userData,req.body.password)
.then(function(){
  passport.authenticate("local")(req,res,function(){
    res.redirect("/profile");
  })
})
})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true,
}),function(req,res){
})

router.get('/logout', function(req, res,) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){ 
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
