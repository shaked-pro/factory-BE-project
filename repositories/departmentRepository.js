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

// async function getDepartmentIdByDepartmentName(depName)
// {
//     try{
//         const relevantDep = await Department.findOne({ Department_Name: depName });
//         console.log ("repository : relevant dep :"+JSON.stringify(relevantDep));
//         let depid = JSON.stringify(relevantDep._id);
//         console.log("repository: dep id: "+depid);
//         return relevantDep._id;
//     }
//     catch(err)
//     {
//         console.log("repository: couldn't find that department: "+ err);
//     }
// }

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
    let employeeRepositoryRes = await employeeRepository.findEmployeesByDepIdAndDelete(depid)
    if (employeeRepositoryRes)
        {
            const result = await Department.findByIdAndDelete(depid);
            if (result) //if the department is deleted result contains the deleted document, checking if the deletion was successful
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

module.exports = {
    getDepartmentNameByDepId,
    getDepartmentByDepId,
    getDepartmentByDepName,
    deleteDepartment,
    getAllDeps
}