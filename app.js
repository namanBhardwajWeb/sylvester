var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongo = require("mongoose");
var cors = require("cors");

var app = express();
// DEFINING PORT NO.
const port = process.env.PORT || 7000;

//IMPORTING FILES
  //IMPORTING ROUTER FILE
  var route = require("./routes/router");
  //IMPORTING CONSTANT FILE
  var consts = require("./Constants/const");

//DATABASE CONNECTION
mongo.connect(consts.database);
mongo.connection.on('error',function(err){console.log(err)});
mongo.connection.on("connected",function(){ console.log("Connection Established With =>"+consts.database); })

//CORS Middle Ware
app.use(cors());

//STATIC FOLDER
app.use(express.static(path.join(__dirname,'public')));

//BODY PARSER
app.use(bodyParser.json());
app.use( bodyParser.urlencoded() );

//ROUTES
app.use("/",route);


//INITIATE SERVER
app.listen(port,function(){
  console.log("server listening at port no. : "+port);
});
