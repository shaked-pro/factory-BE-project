//here we will get the employee data from the DB.
const path = require('path');
const Employee = require(path.resolve('models/employeeModel'));
const EmployeeShift = require(path.resolve('models/shiftEmployeeModel'));
const { MongoClient } = require('mongodb')
const mongoose = require('mongoose');
const { getDepartmentByDepName } = require('../repositories/departmentRepository');
const { getShiftsByEmployee } = require('../repositories/shiftsRepository');
const { ObjectId } = require('mongodb');

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
}

async function getEmployeeById(id) {
    const employee = await Employee.findById(id);
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
    let depId = await getDepartmentByDepName(depName);
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

async function deleteEmployeeByEmployeeId(employeeId) {
    try {
        const result = await Employee.deleteOne({ _id: employeeId }); //deleting employee
        if (result.deletedCount === 1) {
            await EmployeeShift.deleteMany({ employee_id: employeeId }); //deleting employee from shifts
        }
        console.log("employee deleted from db: " + JSON.stringify(result));
    }
    catch (error) {
        console.log("error deleting employee from db: " + error);
    }
}

async function getEmployeesOfDepartment(departmentId) {
    let employees = await Employee.find({ Department_id: departmentId })
    console.log("Repository :employees of department = " + JSON.stringify(employees));
    return employees.map(employee => employee._doc);
}

module.exports = {
    getAllEmployees,
    getEmployeeByName,
    updateEmployeeByName,
    addEmployee,
    getEmployeesOfDepartment,
    getEmployeeById,
    deleteEmployeeByEmployeeId
}