const path = require('path');
const EmployeeShift = require(path.resolve('models/shiftEmployeeModel'));
const { MongoClient } = require('mongodb')
const mongoose = require('mongoose');
const { json } = require('express');

async function getShiftsByEmployee(id) {
    try {
        // Find all EmployeeShift documents for the given employeeId
        const employeeShifts = await EmployeeShift.find({ "employee_id": id });
        return employeeShifts;
    } catch (error) {
        console.error('Error fetching shifts for employee:', error);
        throw error;
    }
}

module.exports = {
    getShiftsByEmployee
}