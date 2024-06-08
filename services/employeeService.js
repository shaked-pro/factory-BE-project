const usersRepo = require ('../repositories/usersRepository');
const json = require ('jsonfile');
const mongoose = require ('mongoose');
const { getAllEmployees, getShiftsByEmployeeId } = require('../repositories/employeesRepository');
const { getEmployeeByName } = require('../repositories/employeesRepository');
const { updateEmployeeByName } = require('../repositories/employeesRepository');
const { getDepartmentNameByDepId } = require('../repositories/departmentRepository');
const { addEmployee } = require('../repositories/employeesRepository');

async function getAllEmployeesToTable(){
  let Employees = await getAllEmployees();
  console.log("employees from service :" + JSON.stringify(Employees));
  return Employees;
}

// async function getShiftsByEmployeeId(id){
//   mongoose.findById(id)
// }

async function getEmployeeDataToEdit(firstName,lastName)
{
  let employeeData = await getEmployeeByName(firstName, lastName)
  return employeeData;
}

async function updateEmployee(updateData)
{
  let lastName = updateData.originalLastName;
  console.log("originalLastName in the service: "+lastName);
  console.log ("update data going to the repo from service: "+ JSON.stringify(updateData));
  let updatedEmployee = await updateEmployeeByName(updateData, lastName);
  console.log ('updated employee from service: '+ JSON.stringify(updatedEmployee));
  return updatedEmployee;
}

async function getDepartmentName(departmentid)
{
  let departmentData = await getDepartmentNameByDepId(departmentid);
  console.log ("Department data from service:" + departmentData);
  let name = JSON.stringify(departmentData.Department_Name);
  console.log ("department name from service : " + name)
  return (name);
}

async function newEmployee(employeeData)
{
  console.log ("new employee data from service : "+JSON.stringify(employeeData));
  await addEmployee(employeeData);//sending the new employee data to the employee repository
}

async function getshiftsOfEmployee(name)
{
  let arrayFirstAndLastName = name.split(" ");
  let employee = await getEmployeeByName(arrayFirstAndLastName[0],arrayFirstAndLastName[1]);
  console.log("relevant employee from service: " + JSON.stringify(employee));
  let shifts  = getShiftsByEmployeeId(employee._id);
}

module.exports={getAllEmployeesToTable ,
  getEmployeeDataToEdit ,
  updateEmployee ,
  getDepartmentName ,
  newEmployee,
  getshiftsOfEmployee};
