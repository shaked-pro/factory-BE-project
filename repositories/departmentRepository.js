const { json } = require('express');
const path = require('path');
const Department = require(path.resolve('models/departmentModel'));
const employeeRepository = require(path.resolve('repositories/employeesRepository'));
const Employee = require(path.resolve('models/employeeModel'));
//const { findEmployeesByDepIdAndDelete } = require(path.resolve('/repositories/employeeRepository'));

async function getDepartmentNameByDepId(id)
{
    const department = await Department.findById(id)
    return department.Department_Name;
}

async function getAllDeps()
{
    const departments = await Department.find({});
    console.log ("All departments from department repo:" +departments);
    return departments;
}

async function updateDepartmentByDepId(updateData, id) {
    try {
        const update = await Department.updateOne({ _id: id },//using a field not available for editing to find the employee
            {
                $set: {
                    _id: id,
                    Department_Manager: updateData.managerId,
                    Department_Name : updateData.departmentName
                    // Department_id: updateData.newDep
                }
            });
        return update.matchedCount > 0 ? 'Department updated successfully' : null;
    }
    catch (error) {
        console.log('Error updating department');
        throw error;
    }
}

async function getDepartmentByDepName(depname)
{
    try {
        console.log (depname);
        const department = await Department.findOne({Department_Name: depname});
        console.log ("relevant department from repository: "+department);
        return department;
    }
    catch(e)
    {
        console.log ("wasn't able to get department from DB : "+e);
    }
}

async function getDepartmentByDepId(depid) {
    try {
        const department = await Department.findOne({ _id: depid });
        console.log("relevant department from repository: " + department);
        return department;
    }
    catch (e) {
        console.log("wasn't able to get department from DB : " + e);
    }
}

async function deleteDepartment(depid)
{
    let employeeDeleteSuccess = await deleteEmployeeByDepId(depid);// finds and deletes all employees of the department
    if (employeeDeleteSuccess) //if the employees were deleted successfully
        {
            const result = await Department.deleteOne({_id:depid});
            if (result.deleteCount > 0) 
            {
                console.log('delete department was completed successfully!');
                return true;
            }
            else {
                console.log('delete department failed! department wasn\'t found');
                return false;
            }
        }
    else 
    {
        console.log ("error deleting department");//there is no empty department therefore no need to delete one
        return false;
    }    
}

async function deleteEmployeeByDepId(depId) {
    try {
        const result = await Employee.deleteMany({ Department_id: depId }); //deleting employees 
        console.log("employees of Department deleted from db: " + JSON.stringify(result));
        if (result.deletedCount > 0) {
            return true;
        }
    }
    catch (error) {
        console.log("error deleting employee from db: " + error);
        return false;
    }
}

module.exports = {
    getDepartmentNameByDepId,
    getDepartmentByDepId,
    getDepartmentByDepName,
    updateDepartmentByDepId,
    deleteDepartment,
    getAllDeps
}