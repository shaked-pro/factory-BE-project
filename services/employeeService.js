const usersRepo = require('../repositories/usersRepository');
const json = require('jsonfile');
const mongoose = require('mongoose');
const { getAllEmployees } = require('../repositories/employeesRepository');
const { getShiftsByEmployee } = require('../repositories/shiftRepository');
const { getEmployeeByName } = require('../repositories/employeesRepository');
const { updateEmployeeByName } = require('../repositories/employeesRepository');
const { getDepartmentNameByDepId, getDepartmentByDepName } = require('../repositories/departmentRepository');
const { addEmployee } = require('../repositories/employeesRepository');
const { getEmployeesOfDepartment } = require('../repositories/employeesRepository');

async function getAllEmployeesToTable() {
  let employees = await getAllEmployees();
  console.log("employees from service :" + JSON.stringify(employees));
  let employeesWithShifts = await addShiftsAndDepartmentToEmployees(employees);
  employeesWithShiftsAndDepartment = employeesWithShifts.map(async (employee) => {
    let employeedepartmentName = await getDepartmentNameByDepId(employee.Department_id);
    console.log("service:department name: " + employeedepartmentName);
    return {
      employeedepartmentName, ...employee
    }
  });
  employeesWithShiftsAndDepartment = await Promise.all(employeesWithShiftsAndDepartment);
  console.log("service:employees with shifts and department: " + JSON.stringify(employeesWithShiftsAndDepartment));
  return employeesWithShiftsAndDepartment;
}

async function addShiftsAndDepartmentToEmployees(employees, departmentName) {
  let employeesWithShifts = employees.map(async (employee) => {
    let shifts = await getShiftsByEmployee(employee._id);
    console.log("service:shifts for employee: " + JSON.stringify(shifts));
    // let departments = await getDepartmentNameByDepId(employee.Department_id);
    // console.log("service:shifts for employee: " + JSON.stringify(shifts));
    let shiftIds = shifts.map(shift => shift.shift_id);
    let employeeWithShifts = { ...employee, "departmentName": departmentName, "shifts": shiftIds };
    console.log("service:employee with shifts and department: " + JSON.stringify(employeeWithShifts));
    return employeeWithShifts;
  });
  employeesWithShifts = await Promise.all(employeesWithShifts);
  console.log("service:employees with shifts and department: " + JSON.stringify(employeesWithShifts));
  console.log(`EmployeesWithShifts: ${typeof (employeesWithShifts)}`);
  return employeesWithShifts;
}

// async function getShiftsByEmployeeId(id){
//   mongoose.findById(id)
// }

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

// async function getshiftsOfEmployee(name)
// {
//   let arrayFirstAndLastName = name.split(" ");
//   let employee = await getEmployeeByName(arrayFirstAndLastName[0],arrayFirstAndLastName[1]);
//   console.log("relevant employee from service: " + JSON.stringify(employee));
//   let shifts  = getShiftsByEmployeeId(employee._id);
// }
async function FilterEmployeesByDep(depName) {
  console.log("service : department name : " + depName)
  let departmentRequested = await getDepartmentByDepName(depName);
  console.log(JSON.stringify(departmentRequested));
  let depId = departmentRequested._id;
  console.log("service: department id: " + depId);
  let relevantEmployees = await getEmployeesOfDepartment(depId);
  console.log("service: employees of department: " + JSON.stringify(relevantEmployees));
  formattedEmployeesData = await addShiftsAndDepartmentToEmployees(relevantEmployees, depName);
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
