const axios = require("axios");
const URLUsers = "https://jsonplaceholder.typicode.com/users"
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function getUserByCredentials(username1, email1) {
  console.log("username:" + username1 + " email:" + email1);
  let res = await axios.get(`${URLUsers}?username=${username1}`);
  //console.log (JSON.stringify(res.data));
  if (res.data[0]== undefined)
  {
    return(false);
  }
  if (res.data[0].email == email1) {

    const payload = {
      username: res.data[0].username,
      email: res.data[0].email
    };

    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secretKey, {
      expiresIn: '1h'
    });
    console.log('Generated Token:', token);
    return({
      success: true,
      token: token
    });
  } else {
    console.log("username or email is incorrect");
    return(false);
  }
}


module.exports = {
  getUserByCredentials
};
