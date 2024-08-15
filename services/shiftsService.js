const shiftsRepo = require('../repositories/shiftsRepository');


// Define the getShifts function
async function getShiftsTable() {
  try {
    let shifts = await shiftsRepo.getAllShifts();
    console.log("shifts from service : " + JSON.stringify(shifts));
    shiftsWithHours = shifts.map(async(shift)=>{
      let plainShift = shift.toObject ? shift.toObject() : { ...shift };
      let shiftHours = `${plainShift.Starting_Hour} - ${plainShift.Ending_Hour}`;
      return { ...plainShift, "hours": shiftHours };
    })
    let shiftsData = await Promise.all(shiftsWithHours);
    console.log ("service:formatted shifts:"+shiftsData);
    return shiftsData;
  } catch (error) {
    console.error('Error getting shifts:', error);
    throw error;
  }
}

module.exports = {
  getShiftsTable
};