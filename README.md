# sylvester
Clone the repository , 
1. perform "npm install" to install all dependencied for the Project.
2. execute command "npm start" in CMD to start the server.
# Registeration (/register API)
1. Request Data = {
    "name" : "******",
    "username" : "******",
    "mobileNo." : "******",
    "email" : "********",
    "password" : "******"
    }
2. A mail will be delivered to the user After Registeration.
3. Redundency in Mobile No. , Email , UserName is not allowed
    
# Login (/auth API)
1. request Data = {
  "userName" : "*****",
  "password" : "*****"
}
# Get User Data (/getUserDetails API)
1. request data = {
  "userId" : "***********", // recieved form login
  "email" : "***********"
}
2. If token recived from login is passed through the header named "jwt_token" , only then a user can access this api.
# Update Profile (/updateProfile API)
1. req data = {
  userId : "*****" //A MUST
}
2. If token recived from login is passed through the header named "jwt_token" , only then a user can access this api.

# Logout
This functionality can be implemented at frontend by discarding the jwt_token.
