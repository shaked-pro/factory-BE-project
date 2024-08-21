const path = require('path');
const Employee = require(path.resolve('models/employeeModel'));
const employeeRepository = require(path.resolve('repositories/employeesRepository'));
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
 * OUTPUT: {}
 */
async function getEmployeeOfOtherShiftsByShiftId(shiftId) {
    let exclusiveEmployeeIds = await EmployeeShift.find({ shift_id: { $ne: shiftId } }).distinct('employee_id'); //to avoid duplicates
    let employeesOfOtherShifts = await Employee.find({ _id: { $in: exclusiveEmployeeIds } })
    console.log("employees of other shifts" + JSON.stringify(employeesOfOtherShifts));
    return employeesOfOtherShifts;
    // let names = employeesByShifts.map(async (employee) => {
    //     let employeeFullName = await getEmployeeByEmployeeId(employee.employee_id);
    //     employeeFullName = `${employeeFullName.First_Name} ${employeeFullName.Last_Name}`;
    //     return employeeFullName;
    // })
    // names = await Promise.all(names);
    // return names;
}

async function getEmployeeByEmployeeId(id)
{
    const employee = await Employee.findById(id);
    return employee;
}

async function getAllShifts() {
    try {
        const allShifts = await Shift.find({});
        return allShifts;
    } catch (error) {
        console.error('Repository: Error fetching all shifts:', error);
        throw error;
    }
}

module.exports = {
    getShiftsByEmployee,
    getAllShifts,
    getEmployeeByShiftId,
    getEmployeeByEmployeeId,
    getEmployeeOfOtherShiftsByShiftId
}