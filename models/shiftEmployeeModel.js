const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');
const Shift = require(path.resolve('models/shiftModel'));
const Employee = require(path.resolve('models/employeeModel'));
// Here I will define the Schema of the connection between the shift and the employee models

const shift_employee = new Schema({
    _id: Schema.Types.ObjectId,
    employee_id: Schema.Types.ObjectId,
    shift_id: Schema.Types.ObjectId
});

const EmployeeShift = mongoose.model('shift_employee', shift_employee);

module.exports = EmployeeShift;
