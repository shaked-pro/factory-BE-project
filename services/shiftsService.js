const shiftsRepo = require('../repositories/shiftsRepository');

// Import the repository module

// Define the getShifts function
async function getShiftsTable() {
  try {
    // Call the repository function to get shifts
    const shifts = await shiftsRepo.getAllShifts();
    console.log("shifts from service : " + JSON.stringify(shifts));

    // Return the shifts to the caller
    return shifts;
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error getting shifts:', error);
    throw error;
  }
}

module.exports = {
  getShiftsTable
};