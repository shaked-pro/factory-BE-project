const shiftsRepo = require('../repositories/shiftsRepository');

/* This function is returning objects containing the shift data. These objects will go to 
 * the frontend to be presented in a table
 * INPUT: NULL
 * OUTPUT: object {shift plainshift , datetime modifiedDate , string hours , employee shiftEmployees}
 */ 
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

/* This function is returning objects containing employee full name and employee id to the frontend. These objects
 * will be used in the feature allowing to allocate/assign employee to a shift.
 * INPUT: (objectId) shift
 * OUTPUT: object {string nameEmployee , objectId idEmployee}
 */ 

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

/* This function returns employees of a specific shift.
 * INPUT: objectId shiftId
 * OUTPUT: Employee employees
 */ 
async function getEmployeeNamesForShifts(shiftId)
{
  let employees = await shiftsRepo.getEmployeeByShiftId(shiftId);
  return employees;
}

/* This function passes the info of the employee and shift for the repository 
 * where the employee selected will be allocated to the shift passed
 * INPUT: objectId employeeId , objectId shiftId
 * OUTPUT: 
 */
async function performEmployeeAllocation(data)
{
  let shiftId = data.shift;
  let employeeId = data.employee;
  let result  = await shiftsRepo.allocateEmployee(employeeId, shiftId);
  console.log ("shifts service:"+result);
}
module.exports = {
  getShiftsTable,
  getEmployeesToAllocationDropDown,
  performEmployeeAllocation
};