const express = require('express');
const path = require('path');
const { getShiftsTable } = require('../services/shiftsService');

const router = express.Router();

// Entry point: http://localhost:3000/shifts

router.get('/', async (req, res) => {
  const acceptHeader = req.headers['accept'];

  console.log(req.headers)
  if (acceptHeader.includes('text/html')) {
    res.sendFile(path.join(__dirname, '../htmlPages/shiftsPage.html'));
  }
  else {
    let shifts = await getShiftsTable();
    console.log ("controller: shifts I got:" + JSON.stringify(shifts));
    res.send(shifts);
  }

});

module.exports = router;