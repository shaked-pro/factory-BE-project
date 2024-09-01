const path = require('path');
const Employee = require(path.resolve('models/employeeModel'));
const employeeRepository = require(path.resolve('repositories/employeesRepository'));
const EmployeeShift = require(path.resolve('models/shiftEmployeeModel'));
const Shift = require(path.resolve('models/shiftModel'));
const mongoose = require('mongoose');

/* This function gets all the shifts of a specific employee given the employee's id.
 * INPUT: objectId id
 * OUTPUT: Shift[]
 */
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

/* This function gets all the employee's full names of a specific shift given the shift's id.
 * INPUT: objectId shiftId
 * OUTPUT: Employee.fullName[] names
 */
async function getEmployeeByShiftId(shiftId)
{
    let employeesByShifts = await EmployeeShift.find({"shift_id": shiftId})
    console.log("employees of shift:"+JSON.stringify(employeesByShifts));
    let names = employeesByShifts.map (async(employee)=>{
        let employeeFullName = await getEmployeeByEmployeeId(employee.employee_id);
        employeeFullName = `${employeeFullName.First_Name} ${employeeFullName.Last_Name}`;
        return employeeFullName;
    })
    names = await Promise.all (names);
    return names;
}

/* This function is used for allocating new employees to given shift. This function brings the 
 * Available employees (those who dont already belong to said shift) to the frontend
 * INPUT: (objectid)shiftId
 * OUTPUT: Employee[]
 */
async function getEmployeeOfOtherShiftsByShiftId(shiftId) {
    console.log ("shift id from repo: "+shiftId);
    let employeeOfGivenShift = await EmployeeShift.find({ shift_id: shiftId }).distinct('employee_id');
    let employeesOfOtherShifts = await Employee.find({
        _id: { $nin: employeeOfGivenShift }
    }).distinct('_id');
    employeesOfOtherShifts = employeesOfOtherShifts.map(async(employee)=>{
        let employeeObject = getEmployeeByEmployeeId(employee);
        return employeeObject;
    })
    employeeObjects = await Promise.all(employeesOfOtherShifts)
    console.log(JSON.stringify(employeeObjects))
    return employeeObjects;
}

/* This function returns an employee according to the employee id
 * INPUT: (objectid) id
 * OUTPUT: Employee
 */
async function getEmployeeByEmployeeId(id)
{
    const employee = await Employee.findById(id);
    return employee;
}

/* This functions acccesses the DB and gets all the shifts and returns them to the service
 * INPUT: NULL
 * OUTPUT: Shift[]
 */
async function getAllShifts() {
    try {
        const allShifts = await Shift.find({});
        return allShifts;
    } catch (error) {
        console.error('Repository: Error fetching all shifts:', error);
        throw error;
    }
}

async function allocateEmployee(employeeId , shiftId) {
    console.log ("assigning employee to shift")
    let newId = new mongoose.Types.ObjectId();
    let allocatedDocument = new EmployeeShift({
        _id: newId,
        employee_id: employeeId,
        shift_id: shiftId
    });
    try {
        const result = await allocatedDocument.save();
        return result;
    }
    catch (err) {
        console.log("couldn't assign employee to shift " + err);
    }
}

async function updateShiftById(shiftId ,updateData) {
    try {
        const update = await Shift.updateOne({ _id: shiftId },//using a field not available for editing
            {
                $set: {
                    _id: shiftId,
                    Date: new Date(updateData.shiftDate),
                    Starting_Hour: new Number(updateData.shiftStart),
                    Ending_Hour: new Number(updateData.shiftEnd)
                }
            });
        console.log('Update operation result:', update);
        return update.matchedCount > 0 ? 'shift updated successfully' : null;
    }
    catch (error) {
        console.log('Error updating shift'+ error);
        throw error;
    }
}

async function createShift(shiftData)
{   
    let newId = new mongoose.Types.ObjectId();
    let newShift = new Shift({
        _id: newId,
        Date: new Date(shiftData.shiftDate),
        Starting_Hour:new Number(shiftData.shiftStart),
        Ending_Hour:new Number(shiftData.shiftEnd)
    });
    try {
        const result = await newShift.save();
        return result;
    }
    catch (err) {
        console.log("couldn't create new shift " + err);
    }
}

module.exports = {
    getShiftsByEmployee,
    getAllShifts,
    getEmployeeByShiftId,
    getEmployeeByEmployeeId,
    getEmployeeOfOtherShiftsByShiftId,
    allocateEmployee,
    updateShiftById,
    createShift
}