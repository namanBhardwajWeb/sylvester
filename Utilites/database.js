var bcrypt = require("bcryptjs");
var commonFunct = require('./utilities.js');

var time = new Date();

exports.saveAccess = function(access){
    access.save(function(err){
        if(err){ console.log("ERROR ENCOUNTERED  :  "+err); }
    })
}

exports.registerUser = function(user,res){

    var pass_raw = user.password;

    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(user.password,salt,function(err,hash){
          if(!err){
              user.password = hash;
              user.save(function(err){
                  if(err){
                      res.json({"success":false,"msg": err });
                  }
                  else{
                      commonFunct.Mailer(res,user,pass_raw);
                  }
              });
          }
          else{
              console.log("soem error database-registerUser  : "+err);
          }
        })
    });

    user.save(function(err){
        if(err){ console.log("ERROR ENCOUNTERED 1 :  "+err); }
    })

}

exports.compareHashPassword = function(pass,hashPass,callback){
    bcrypt.compare(pass,hashPass,function(err,isMatch){
        if(err) { console.log("ERROR ENCOUNTERED 2 :  "+err); }
        callback(err,isMatch);

    })
}
