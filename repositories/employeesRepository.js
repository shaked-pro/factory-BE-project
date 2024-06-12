//here we will get the employee data from the DB.
const path = require('path');
const Employee = require(path.resolve('models/employeeModel'));
const axios = require('axios');
const { MongoClient } = require('mongodb')
const mongoose = require('mongoose');
const { getDepartmentIdByDepartmentName } = require('../repositories/departmentRepository');
const { getShiftsByEmployee } = require('../repositories/shiftRepository');

const getAllEmployees = async () => {
    try {
        const employees = await Employee.aggregate([
            {
                $addFields: {
                    fullName: { $concat: ["$First_Name", " ", "$Last_Name"] }
                }
            },
            {
                $project: { _id: 1, fullName: 1, Department_id: 1 }
            }
        ]);
        return employees;
    }
    catch (error) {
        console.log("error fatching data from db: " + error);
    }
    finally {
        // await client.close();
    }
}

async function getEmployeeById(id) {
    const employee = await Employee.findById(id)
    return employee;
}

async function getEmployeeByName(firstName, lastName) {
    try {
        const employee = await Employee.findOne({ First_Name: firstName, Last_Name: lastName });
        console.log("employee returned to server from repo : " + JSON.stringify(employee));
        return employee;
    } catch (error) {
        console.error('Error fetching employee by name:', error);
        throw error;
    }

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

async function addEmployee(employeeData) {
    let depName = employeeData.departmentName;
    console.log("department name from employee repo: " + depName);
    let depId = await getDepartmentIdByDepartmentName(depName);
    let employeeToAdd = new Employee({
        _id: employeeData.id,
        First_Name: employeeData.firstName,
        Last_Name: employeeData.lastName,
        Start_Work_Year: employeeData.year,
        Department_id: depId
    });
    try {
        const result = await employeeToAdd.save();
    }
    catch (err) {
        console.log("couldn't add employee to DB: " + err);
    }
}

async function getShiftsByEmployeeId(employeeid) {
    // console.log("employee id from employee repo: " + employeeid);
    let shifts = await getShiftsByEmployee(employeeid);
    return JSON.stringify(shifts);
    // deleteEmployee(employeeid, shifts);
}

async function deleteEmployee(employeeId, shifts) {

}
async function findEmployeesByDepIdAndDelete(depid) {
    let relevantEmployees = await Employee.deleteMany({ Department_id: depid });//will add an operation to update the shifts later
    if (relevantEmployees) {
        console.log("relevant employees were deleted");
        return true;
    }
    else {
        console.log("relevant employees weren't deleted");
        return false;
    }
}

module.exports = {
    getAllEmployees,
    getEmployeeById,
    getEmployeeByName,
    updateEmployeeByName,
    addEmployee,
    getShiftsByEmployeeId,
    findEmployeesByDepIdAndDelete
}