const express = require('express')
const cors = require('cors');
const connectDB = require('./config/db');
const employeeController = require('./controllers/employeeController');
const usersController = require('./controllers/usersController');
const departmentController = require('./controllers/departmentController');
const shiftController = require('./controllers/shiftsController');
const navigatorController = require('./controllers/navigatorController');
const commonUsage = require('./commonUsage');

const app = express();
const PORT = 3000;

connectDB();


//middlewares
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/htmlPages/loginPage.html');
});

// add auth middleware
app.use(async (req, res, next) => {
  if (req.path === '/' || req.headers['accept'].includes('text/html')) {
    return next();
  }
  if (req.headers['authorization'] != null) {
    const passedToken = req.headers['authorization'];
    const tokenMatch = passedToken ? passedToken.match(/Bearer\s+([^\s]+)/) : null;
    const token = tokenMatch ? tokenMatch[1] : null;
    const verified = await commonUsage.verifyMyToken(token);
    if (verified) {
      console.log(`verified status: ${JSON.stringify(verified)}`);
      // add user to request object
      req.user = verified;
      console.log(`req.user middleware: ${JSON.stringify(req.user)}`)
      return next();
    } else {
      return res.sendStatus(401);
    }
  } else {
    return res.sendStatus(401);
  }
});

app.use('/home', navigatorController);
app.use('/users', usersController);
app.use('/shifts', shiftController);
app.use('/employees', employeeController);
app.use('/employees/editEmployee', employeeController);
app.use('/departments', departmentController);
app.use('/departments/editDepartment', departmentController);

app.listen(PORT, () => {
  console.log(`app is listening at http://localhost:${PORT}`);
});
