const shiftsRepo = require('../repositories/shiftsRepository');
const employeeRepo = require('../repositories/employeesRepository');

// Define the getShifts function
async function getShiftsTable() {
  try {
    let shifts = await shiftsRepo.getAllShifts();
    console.log("shifts from service : " + JSON.stringify(shifts));
    shiftsWithHours = shifts.map(async(shift)=>{
      let plainShift = shift.toObject ? shift.toObject() : { ...shift };
      let shiftHours = `${plainShift.Starting_Hour} - ${plainShift.Ending_Hour}`;
      let modifiedDate = await plainShift.Date.toLocaleDateString();
      let shiftEmployees = await getEmployeeNamesForShifts(plainShift._id);
      return { ...plainShift, "modifiedDate": modifiedDate, "hours": shiftHours, "employees": shiftEmployees };
    })
    let shiftsData = await Promise.all(shiftsWithHours);
    console.log ("service:formatted shifts:"+shiftsData);
    return shiftsData;
  } catch (error) {
    console.error('Error getting shifts:', error);
    throw error;
  }
}

async function getEmployeesToAllocationDropDown(shift)
{
  let employees = await shiftsRepo.getEmployeeOfOtherShiftsByShiftId(shift);
  let employeeNamesAndIds = employees.map(async (employee) => {
      let nameEmployee = await employee.fullName;
      let idEmployee = await employee._id;
      return { "nameEmployee": nameEmployee, "idEmployee": idEmployee };
  })
  let employeesData = await Promise.all(employeeNamesAndIds);
  console.log("employee names: " + JSON.stringify(employeesData));
  return employeesData;
}

async function getEmployeeNamesForShifts(shiftId)
{
  let employees = await shiftsRepo.getEmployeeByShiftId(shiftId);
  return employees;
}

module.exports = {
  getShiftsTable,
  getEmployeesToAllocationDropDown
};