const usersRepo = require('../repositories/usersRepository');
const json = require('jsonfile');
const mongoose = require('mongoose');
const { getAllEmployees } = require('../repositories/employeesRepository');
const { getShiftsByEmployee } = require('../repositories/shiftRepository');
const { getEmployeeByName } = require('../repositories/employeesRepository');
const { updateEmployeeByName } = require('../repositories/employeesRepository');
const { getDepartmentNameByDepId, getDepartmentByDepId } = require('../repositories/departmentRepository');
const { addEmployee } = require('../repositories/employeesRepository');
const { getEmployeesOfDepartment } = require('../repositories/employeesRepository');


/* gets all the employees to the employees page (unfiltered) and adds the department name and shifts
 * INPUT: null
 * OUTPUT: boject(employeedepartmentName , ...employee)
*/ 
async function getAllEmployeesToTable() {//change name of func not to include table 
  let employees = await getAllEmployees();
  console.log("employees from service :" + JSON.stringify(employees));
  let completeEmployeesData = employees.map (async (employee)=>{
    let currentEmployeeShifts = await getShiftsByEmployee(employee._id);
    let currentDepartment = await getDepartmentNameByDepId(employee.Department_id);
    currentEmployeeShifts = currentEmployeeShifts.map(shift => shift.shift_id);
    return ({ ...employee, "employeedepartmentName": currentDepartment, "shift_id": currentEmployeeShifts});
  })
  completeEmployeesData = await Promise.all(completeEmployeesData);
  return (completeEmployeesData);
}

/* gets employee objects and creates new objects containing their department name and shifts
 * INPUT: employees (objects) , departmentName(string) 
 * OUTPUT: boject( ...employee, "departmentName": departmentName, "shifts": shiftIds)
*/ 
async function addShiftsAndDepartmentToEmployees(employees, departmentName) {
  console.log (typeof(employees))
  let employeesWithShifts = employees.map(async (employee) => {
    let shifts = await getShiftsByEmployee(employee._id);
    console.log("service:shifts for employee: " + JSON.stringify(shifts));
    let shiftIds = shifts.map(shift => shift.shift_id);
    let employeeWithShifts = { "departmentName": departmentName, ...employee, "shifts": shiftIds };
    console.log("service:employee with shifts and department: " + JSON.stringify(employeeWithShifts));
    return employeeWithShifts;
  });
  employeesWithShifts = await Promise.all(employeesWithShifts);
  console.log("service:employees with shifts and department: " + JSON.stringify(employeesWithShifts));
  return employeesWithShifts;
}

async function getEmployeeDataToEdit(firstName, lastName) {
  let employeeData = await getEmployeeByName(firstName, lastName)
  return employeeData;
}

async function updateEmployee(updateData) {
  let lastName = updateData.originalLastName;
  console.log("originalLastName in the service: " + lastName);
  console.log("update data going to the repo from service: " + JSON.stringify(updateData));
  let updatedEmployee = await updateEmployeeByName(updateData, lastName);
  console.log('updated employee from service: ' + JSON.stringify(updatedEmployee));
  return updatedEmployee;
}

async function newEmployee(employeeData) {
  console.log("new employee data from service : " + JSON.stringify(employeeData));
  await addEmployee(employeeData);//sending the new employee data to the employee repository
}

/* gets department id and returns that department's employees than calls a function which
 * organizes that data into objects that are sent to the front-end
 * INPUT: depId(objectId)
 * OUTPUT: object { ...employee, "departmentName": departmentName, "shifts": shiftIds }
*/ 
async function FilterEmployeesByDep(depId) {
  let depName = await getDepartmentNameByDepId(depId)
  let relevantEmployees = await getEmployeesOfDepartment(depId);
  console.log("service: employees of department: " + JSON.stringify(relevantEmployees));
  let relevantEmployeesWithName = relevantEmployees.map(async(employee)=>{
  let employeeFullName = await `${employee.First_Name} ${employee.Last_Name}`;
    return {
      ...employee, "fullName": employeeFullName
    }
  })
  let filteredEmployeesWithFullName = await Promise.all(relevantEmployeesWithName);
  formattedEmployeesData = await addShiftsAndDepartmentToEmployees(filteredEmployeesWithFullName, depName);
  console.log("service: formatted employees data with shifts: " + JSON.stringify(formattedEmployeesData));
  return formattedEmployeesData;
}

module.exports = {
  getAllEmployeesToTable,
  getEmployeeDataToEdit,
  updateEmployee,
  newEmployee,
  FilterEmployeesByDep
};
