const path = require('path');
const EmployeeShift = require(path.resolve('models/shiftEmployeeModel'));
const Shift = require(path.resolve('models/shiftModel'));

async function getShiftsByEmployee(id) {
    try {
        const employeeShifts = await EmployeeShift.find({ "employee_id": id });
        console.log("employee shifts from repo : " + JSON.stringify(employeeShifts));
        return employeeShifts;
    } catch (error) {
        console.error('Error fetching shifts for employee:', error);
        throw error;
    }
}

async function getAllShifts() {
    try {
        const allShifts = await Shift.find({});
        return allShifts;
    } catch (error) {
        console.error('Error fetching all shifts:', error);
        throw error;
    }
}

module.exports = {
    getShiftsByEmployee,
    getAllShifts
}