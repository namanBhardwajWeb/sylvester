var nodemailer = require('nodemailer');

exports.Mailer = function(res,user,deCryptPass){
    var mailFrom = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'webbertest1122@gmail.com',
            pass:'test12345678'
        }
    });
    
    var mailTo = {
        from:'Admin<admin@test.com>',
        to: user.email,
        subject:'Registered',
        text:'Congratulations For Registeration',
        html:" <h4>Hello"+user.name+" !!</h4><br>" +
            "Congratulations for registeration..<br>Your Credentials are :<br>"+
            "<label>User-Name</label> = "+user.username+
            "<label>Password</label> = "+deCryptPass            
    };
    
    mailFrom.sendMail(mailTo,function(err){
        if(err){ console.log(err); }
        else{
            res.json({success:true , msg : "User Registered"});
        }
    });

    mailFrom.close();
}