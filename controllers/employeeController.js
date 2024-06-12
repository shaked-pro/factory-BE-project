const express = require('express');
const { MongoClient } = require('mongodb');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const employeeService = require('../services/employeeService');
const commonUsage = require('../commonUsage');

const mongoURL = 'mongodb://localhost:27017';

const router = express.Router();

// Entry point: http://localhost:3000/employee

router.get('/', async (req, res) => {
  let headers = await req.headers;
  console.log(headers);
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
  else if (headers['referer'] != null && headers['referer'].includes('http://localhost:3000/employee') && headers['editEmployeeReferer']) {
    return res.sendFile(path.resolve('htmlPages/editEmployeePage.html'));
    //need to add logic of sending the edit employee page the specific employee info.
  }
  else if (headers['collectemployeedata'] != null && headers['referer'] != null && headers['referer'].includes('http://localhost:3000/employee')) {
    let data = await employeeService.getAllEmployeesToTable();
    console.log("employees from constroller :" + JSON.stringify(data));
    return res.send(data);
  }
  else if (headers['departmentid'] != null) {
    console.log("get to the department if in the constroller");
    let depName = await employeeService.getDepartmentName(headers["departmentid"]);
    console.log("department from controler :" + depName);
    return res.send(depName);
  }
  else {
    console.log("reached here with the xmlhttprequest No");
    return res.sendFile(path.resolve('htmlPages/employeesPage.html'));
  }
});

//edit employee routs
router.get('/editEmployee', async (req, res) => {
  let headers = await req.headers;
  console.log(headers);
  if (headers['firstnameemployee'] != null) {
    let data = await employeeService.getEmployeeDataToEdit(headers['firstnameemployee'], headers['lastnameemployee']);
    return res.send(data);
  }
  // else if (headers['shiftsgetter']) {
  //   let shifts = employeeService.getshiftsOfEmployee(headers['name']);
  // }
  const name = req.query.name;
  console.log(name);
  return res.sendFile(path.resolve('htmlPages/editEmployeePage.html'));
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
