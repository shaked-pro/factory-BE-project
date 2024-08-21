const express = require('express');
const path = require('path');
const { getShiftsTable, getEmployeesToAllocationDropDown } = require('../services/shiftsService');


const router = express.Router();

// Entry point: http://localhost:3000/shifts

router.get('/', async (req, res) => {
  const acceptHeader = req.headers['accept'];

  console.log(req.headers)
  if (acceptHeader.includes('text/html')) {
    res.sendFile(path.join(__dirname, '../htmlPages/shiftsPage.html'));
  }
  else if (!req.query["idOfShift"]){
    let shifts = await getShiftsTable();
    console.log ("controller: shifts I got:" + JSON.stringify(shifts));
    res.send(shifts);
  }
  else 
  {
    let shift = req.query["idOfShift"];
    let employeeNamesSAndId = await getEmployeesToAllocationDropDown(shift);
    console.log (JSON.stringify(employeeNamesSAndId));
    res.send(employeeNamesSAndId);
  }

});

module.exports = router;