const { getAllDeps } = require('../repositories/departmentRepository');
const { getDepartmentByDepName } = require('../repositories/departmentRepository');
const { deleteDepartment } = require('../repositories/departmentRepository')
const { getEmployeesOfDepartment, getEmployeeById } = require('../repositories/employeesRepository')

async function getDepartmentData(depname) {
    let relevantDep = await getDepartmentByDepName(depname);
    console.log("relevant department from service : " + JSON.stringify(relevantDep));
    return relevantDep;
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
    getDepartmentData,
    deleteDepartmentByDepId,
    getAllDepartmentsFromDB
}