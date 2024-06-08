//here we will get the users data from the server.
//https://jsonplaceholder.typicode.com/users

const axios = require('axios');
const URL = 'https://jsonplaceholder.typicode.com/users';

const getAllUsers=async()=>{
  const resp = await axios.get(`${URL}`);
  return resp;
}

async function getUserById(id){
    const resp = await axios.get(`${URL}?id =${id}`);
    return resp;
}

module.exports= {
  getAllUsers,
  getUserById
}
