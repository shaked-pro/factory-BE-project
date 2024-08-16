const { json } = require('express');
const { getAllDeps } = require('../repositories/departmentRepository');
//const { getDepartmentByDepName } = require('../repositories/departmentRepository');
const { deleteDepartment } = require('../repositories/departmentRepository')
const { getDepartmentByDepId, updateDepartmentByDepId } = require('../repositories/departmentRepository')
const { getEmployeesOfDepartment, getEmployeeById } = require('../repositories/employeesRepository')

// async function getDepartmentData(depname) { //turn into depId
//     let relevantDep = await getDepartmentByDepName(depname);
//     console.log("relevant department from service : " + JSON.stringify(relevantDep));
//     return relevantDep;
// }

async function getDepartmentDataById(depId) { 
    let relevantDep = await getDepartmentByDepId(depId);
    console.log("relevant department from service : " + JSON.stringify(relevantDep));
    return relevantDep;
}

async function updateDepartmentData(updateData, depId)
{
    upadtedDepartment = await updateDepartmentByDepId(updateData, depId);
    console.log ("service: updated Department:"+JSON.stringify(upadtedDepartment));
    return upadtedDepartment;
}

/* this function is collecting the department name , manager name and employees of a department. 
 * it organizes the data in objects she returns back to the controller 
 * INPUT: NULL
 * OUTPUT: object ("departmentName":department.Department_Name,"managerName":managerName,"employees":employeeIds,
 * "departmentId":department._id,"managerId":department.Department_Manager)
*/
async function getAllDepartmentsFromDB() {
    let departments = await getAllDeps();
    let DepartmentWithEmployeesData = departments.map(async (department) => {
        let managerName = await getEmployeeById(department.Department_Manager);
        managerName = managerName.fullName;
        let employees = await getEmployeesOfDepartment(department._id);
        let employeeIds = employees.map(employee => employee._id);
        return {
            "departmentName": department.Department_Name,
            "managerName": managerName,
            "employees": employeeIds,
            "departmentId": department._id,
            "managerId": department.Department_Manager
        };
    });
    DepartmentWithEmployeesData = await Promise.all(DepartmentWithEmployeesData);
    return DepartmentWithEmployeesData;
}

async function deleteDepartmentByDepId(depid) {
    let success = await deleteDepartment(depid);
    return success;
}

module.exports = {
    getDepartmentDataById,
    deleteDepartmentByDepId,
    getAllDepartmentsFromDB,
    updateDepartmentData
}