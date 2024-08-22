const express = require('express')
const cors = require('cors');
const connectDB = require('./config/db');
const employeeController = require('./controllers/employeeController');
const usersController = require('./controllers/usersController');
const departmentController = require('./controllers/departmentController');
const shiftController = require('./controllers/shiftsController');
const navigatorController = require('./controllers/navigatorController');

const app = express();
const PORT = 3000;

connectDB();


//middlewares
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/htmlPages/loginPage.html');
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
