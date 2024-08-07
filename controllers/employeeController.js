const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

const employeeService = require('../services/employeeService');
const commonUsage = require('../commonUsage');
const { JsonWebTokenError } = require('jsonwebtoken');

const mongoURL = 'mongodb://localhost:27017';

const router = express.Router();

// Entry point: http://localhost:3000/employees

router.get('/', async (req, res) => {
  console.log(`params: ${JSON.stringify(req.query)}`)
  let headers = await req.headers;
  console.log(headers);

  //auth functionality
  if (headers['authorization'] != null) {
    //accessing common to verify the token 
    const passedToken = headers['authorization'];
    const tokenMatch = passedToken ? passedToken.match(/Bearer\s+([^\s]+)/) : null;
    console.log("tokenMatch?", tokenMatch);
    const token = tokenMatch ? tokenMatch[1] : null;
    const varified = await commonUsage.verifyMyToken(token);
    if (varified) {
      return res.send(varified);
    }
    else {
      console.log("not allowed");
    }
  }

  //departmentFilter functionality
  if (req.query["department"]) {
    let departmentFilter = req.query["department"];
    console.log("the department filter: " + departmentFilter);
    let filteredEmployees = await employeeService.FilterEmployeesByDep(departmentFilter);
    console.log("controller: Filtered employees = " + JSON.stringify(filteredEmployees));
    res.send(filteredEmployees);
  }

  //employee table functionality
  else if (req.query['getemployees']) {
    let data = await employeeService.getAllEmployeesToTable();
    console.log("employees from constroller :" + JSON.stringify(data[1]));
    return res.send(data);
  }

  //redirect functionality
  else {
    console.log("reached here from the login page");
    return res.sendFile(path.resolve('htmlPages/employeesPage.html'));
  }
});

//edit employee routs
router.get('/editEmployee', async (req, res) => {
  let headers = await req.headers;
  console.log (headers);

  //redirect functionality
  if (headers['referer'] != null && (headers['referer'].includes('http://localhost:3000/departments') || headers['referer']==='http://localhost:3000/employees'))
  {
    return res.sendFile(path.resolve('htmlPages/editEmployeePage.html'));
  }

  //get data of employee functionality
  if (req.query["employeeid"] != null) {
    let data = await employeeService.getEmployeeDataToEdit(req.query["employeeid"]);
    return res.send(data);
  }
});
router.post('/editEmployee', async (req, res) => {
  let body = await req.body;
  console.log(body);
  if (body['originallastname'] != null) {
    let updateDataToServer =
    {
      originalLastName: body['originallastname'],
      newId: body['newId'],
      newFirst: body['newFirst'],
      newYear: body['newYear'],
      newDep: body['newDep']
    }
    console.log("checking update data on controller " + JSON.stringify(updateDataToServer));
    let data = await employeeService.updateEmployee(updateDataToServer);
    return res.send(data);
  }
  else {
    console.log("error updating employee");
    return;
  }
});

//add Employee routs
router.post('/addEmployee', async (req, res) => {
  let body = await req.body;
  console.log(body);
  if (body['employeeid'] != null) {
    let newEmployeeData =
    {
      id: body['employeeid'],
      firstName: body['firstname'],
      lastName: body['lastname'],
      year: body['startyear'],
      departmentName: body['department']
    }
    console.log("new employee data from controller: " + JSON.stringify(newEmployeeData));
    await employeeService.newEmployee(newEmployeeData);
  }
  else {
    console.log("error adding a new employee");
    return;
  }
});
router.get('/addEmployee', async (req, res) => {
  let body = await req.body;
  console.log(body);
  return res.sendFile(path.resolve('htmlPages/addEmployee.html'));
});


module.exports = router;
