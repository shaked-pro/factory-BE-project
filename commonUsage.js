const jwt = require('jsonwebtoken');

//for every request i will verify my token
async function verifyMyToken(token) {
  return await jwt.verify(token, process.env.SECRET_KEY, (error, success) => {
    if (error) {
      console.log("token invalid");
      return false;
    } else {
      console.log("token verified");
      return success;
    }
  });
};

async function logOutToLoginPage() {
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/htmlPages/loginPage.html');
  });
}

module.exports = { verifyMyToken };