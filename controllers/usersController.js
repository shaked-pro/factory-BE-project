const express = require('express');
const userService = require('../services/usersService');
const path = require('path');

const router = express.Router();

// Entry point: http://localhost:3000/user

router.get('/', async (req,res) =>{
  console.log("got to the users controller get func");
  res.sendFile(path.resolve('htmlPages/LoginPage.html'));
});

router.post('/' ,async(req,res)=>{
  console.log("reached post");
  await req.body;
  let data = req.body;
  let verification = await userService.getUserByCredentials(data.username , data.email);
  res.send(verification);
});

module.exports = router;
