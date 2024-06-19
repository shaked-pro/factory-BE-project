const usersRepo = require('../repositories/usersRepository');
const json = require('jsonfile');
const mongoose = require('mongoose');
const { getDepartmentNameByDepId, getAllDeps } = require('../repositories/departmentRepository');
const { getDepartmentByDepName } = require('../repositories/departmentRepository');
const { deleteDepartment } = require ('../repositories/departmentRepository')
const {getEmployeesOfDepartment,getEmployeeById} = require('../repositories/employeesRepository')

async function getDepartmentData (depname)
{
    let relevantDep = await getDepartmentByDepName(depname);
    console.log ("relevant department from service : "+JSON.stringify(relevantDep));
    return relevantDep;
}

async function getAllDepartmentsFromDB()
{
    let departments = await getAllDeps();
    let DepartmentWithEmployeesData =departments.map(async (department) => {
    let managerName = await getEmployeeById(department.Department_Manager);
    let employees = await getEmployeesOfDepartment(department._id);
    console.log("DepService: employees of department " + JSON.stringify(employees));
    console.log ("DepService: Department Manager:" + JSON.stringify(managerName));
    let employeeIds = employees.map(employee => employee._id);
    let DepartmentWithEmployeesData = { ...department ,"managername" : managerName, "employees": employeeIds };
    return DepartmentWithEmployeesData;
  });
  DepartmentWithEmployeesData = await Promise.all(DepartmentWithEmployeesData);
  console.log(`DepartmentWithEmployeesData: ${typeof (DepartmentWithEmployeesData)}`);
  return DepartmentWithEmployeesData;
}

async function deleteDepartmentByDepId(depid) {
    let success = await deleteDepartment(depid);
    return success;
} 

module.exports ={
    getDepartmentData,
    deleteDepartmentByDepId,
    getAllDepartmentsFromDB
}