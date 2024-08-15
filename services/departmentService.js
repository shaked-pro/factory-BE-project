const { getAllDeps } = require('../repositories/departmentRepository');
//const { getDepartmentByDepName } = require('../repositories/departmentRepository');
const { deleteDepartment } = require('../repositories/departmentRepository')
const { getDepartmentByDepId } = require('../repositories/departmentRepository')
const { getEmployeesOfDepartment, getEmployeeById } = require('../repositories/employeesRepository')

// async function getDepartmentData(depname) { //turn into depId
//     let relevantDep = await getDepartmentByDepName(depname);
//     console.log("relevant department from service : " + JSON.stringify(relevantDep));
//     return relevantDep;
// }

async function getDepartmentDataById(depId) { //turn into depId
    let relevantDep = await getDepartmentByDepId(depId);
    console.log("relevant department from service : " + JSON.stringify(relevantDep));
    return relevantDep;
}

async function updateEmployeeByName(updateData, lastName) {
    try {
        const update = await Employee.updateOne({ Last_Name: lastName },//using a field not available for editing to find the employee
            {
                $set: {
                    _id: updateData.newId,
                    First_Name: updateData.newfirst,
                    Start_Work_Year: updateData.newYear,
                    Department_id: updateData.newDep
                }
            });
        return update.matchedCount > 0 ? 'Employee updated successfully' : null;
    }
    catch (error) {
        console.log('Error updating employee');
        throw error;
    }
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
    getAllDepartmentsFromDB
}