const express = require('express');
const path = require('path');
const { getShiftsTable, getEmployeesToAllocationDropDown, performEmployeeAllocation, updateShift, addNewShift } = require('../services/shiftsService');


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

router.post('/', async (req,res)=>{
  data = await req.body;
  console.log (data);
  if (req.query['shiftId'])
  {
    console.log("alloc data from controller:" + JSON.stringify(data));
    await performEmployeeAllocation(data);
  }
  else {
    console.log("add data from controller:" + JSON.stringify(data));// add adding shift functionality
    let newShiftAdded =await addNewShift(data);
    res.send(newShiftAdded);
  }

})

router.put('/', async (req,res)=>{
  data = await req.body;
  console.log ("update data from controller:"+JSON.stringify(data));
  let updatedShift = await updateShift(data);
  res.send(updatedShift);
})
module.exports = router;