var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var ObjectID = require("mongodb").ObjectID;
var bcrypt = require("bcryptjs");

var databaseFunct = require("../Utilites/database");
var dbSchemas = require("../Utilites/schemas");

var consts = require("../Constants/const");

var time = new Date();

// router.get("/home",passport.authenticate('users-local', { session: false}),function(req,res){
// 	res.json({ success : true , user : req.user});
// });

router.post("/register",function(req,res){
	if(req.body.name && req.body.username && req.body.mobileNo && req.body.password && req.body.email){
		dbSchemas.registerUser.findOne({$or:[
												{ email : req.body.email },
												{ username : req.body.username },
												{ mobileNo : req.body.mobileNo }
											]
										},function(err,data){
											if(err){ res.json({ success : false , msg : err }) }
											if(data){ res.json({success : false, msg:"user Already Exists"}); }
											else {
												var user = new dbSchemas.registerUser({

													name: req.body.name,
													username: req.body.username,
													email: req.body.email,
													password: req.body.password,
													mobileNo: req.body.mobileNo,
													time: time.toString(),
													userType : "LOCAL"
												});

												var profile = new dbSchemas.usersCompleteProfile({
													userId : user._id,
													userType : "LOCAL",
													name : req.body.name,
													username : req.body.username,
													email : req.body.email,
													password : req.body.password,
													mobileNo : req.body.mobileNo,
													fathersName : "",
													mothersName : "",
													maxEducation : "",
													lastLogin :[ { time : time.toString() } ]
												});

												profile.save(function(err){
													if(err) res.json({ success : false , msg : err })
													else{
														databaseFunct.registerUser(user, res);
													}
												});
											}
										})

	}
	else{
		res.json({ success : false , msg : 'name* , password* , email* , mobileno.* Feild Are REQUIRED ' })
	}
});

router.post("/auth",function(req,res){
	var userName = req.body.userName;
	var pass = req.body.password;
	if(userName && pass){
		dbSchemas.registerUser.findOne({username:userName},function(err,user){

			if(err) res.json({ success : true , msg : "ERROR ENCOUNTERED  :  "+err })

			if(!user){
				res.json({ success : false , msg : "No Data Found"});
			}
			else{
				databaseFunct.compareHashPassword(pass,user.password, function(err,isMatch){
					if(err) res.json({ success : true , msg : "ERROR ENCOUNTERED  :  "+err });

					if(isMatch){
						dbSchemas.usersCompleteProfile.findOneAndUpdate({ userId : user._id },{$push : {lastLogin : { time : new Date().toLocaleString("en-IN", {timeZone: "Asia/Calcutta"}) }}},function(err,profile){
							if(err) res.json({ success : false , msg : err });
							if(profile){
								var token = jwt.sign(user, consts.secret,{ expiresIn : 16100 });// 

								res.json({
									success:true,
									token: token,
									user:{
										id:user.id,
										name:user.name,
										username:user.username,
										email:user.email,
										mobile:user.mobileNo
									}
								})
							}
							else{
								res.json({ success : false , msg : 'No Such User Found In Database' });
							}
						})
						
					}
					else{
						res.json({ success : false , msg : "invalid password" });
					}
				});

			}
		})
	}
	else{
		res.json({ success : false , msg : "userName & Password Are REQUIRED" });
	}
});

router.post('/getUserDetails',ifLogin,function(req,res){
	if(req.body.userId && req.body.email){
		dbSchemas.usersCompleteProfile.findOne({ userId : req.body.userId },function(err,profile){
			if(err) res.json({ success : false , msg : err });
			if(profile){
				if(profile.email == req.body.email)res.json({success : true , data : profile});
				else res.json({ success : false , msg : 'Email Does Not Matches' });
			}
			else{
				res.json({ success : false , msg : 'No Such User Found In Database' });
			}
		})
	}
	else{
		res.json({ succes : false , msg : 'BAD REQUEST' })
	}
});

router.post('/updateProfile',ifLogin,function(req,res){
	 if(req.body.userId){
		 var id =  req.body.userId;
		 	delete req.body.userId;
			dbSchemas.usersCompleteProfile.findOneAndUpdate({userId : id},req.body,function(err,profile){
					if(err) res.json({ success : false , msg : err });
					if(!profile)res.json({ success : true , msg : 'No Such User Found' });
					else{
						res.json({ success : true , msg : 'User Updated Successfully' , data : profile });
					}
			})
	 }
	 else res.json({ success : false , msg : 'ID is Required' });
});

router.get('**', (req, res) => {
	res.json({ success : false , msg : 'No Such API Exists' });
});



function ifLogin(req, res, next) {
// console.log(req)
  var token = req.headers['jwt_token'];

  if (token) {

    jwt.verify(token,consts.secret, function(err, decoded) {

      if (err) {

        return res.json({ success: false, msg: 'Failed to authenticate token.'+err });
      } else {

        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.json({
        success: false,
        msg: 'No token provided.'
    });

  }
}

module.exports = router;
