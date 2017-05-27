var mongo = require("mongoose");
var ObjectID = mongo.ObjectID;
var schema = mongo.Schema;



var registerUser = new schema({

    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    mobileNo : {
        type : Number,
        required : true
    },
    time:{
        type:String
    },
    userType : String
});

var usersCompleteProfile = new schema({
  userId : String,
  userType : String,
  name : String,
  username : String,
  email : String,
  mobileNo : Number,
  fathersName : String,
  mothersName : String,
  maxEducation : String,
  lastLogin : [ { time : String } ]
});

exports.registerUser            = mongo.model('registerUser',registerUser,'userRecord');
exports.usersCompleteProfile    = mongo.model('profile',usersCompleteProfile,'UserCompleteProfile');
