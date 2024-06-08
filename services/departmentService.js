const usersRepo = require('../repositories/usersRepository');
const json = require('jsonfile');
const mongoose = require('mongoose');
const { getDepartmentNameByDepId } = require('../repositories/departmentRepository');
const { getDepartmentByDepName } = require('../repositories/departmentRepository');
const { deleteDepartment } = require ('../repositories/departmentRepository')

async function getDepartmentData (depname)
{
    let relevantDep = await getDepartmentByDepName(depname);
    console.log ("relevant department from service : "+JSON.stringify(relevantDep));
    return relevantDep;
} 

async function deleteDepartmentByDepId(depid) {
    let success = await deleteDepartment(depid);
    return success;
} 

module.exports ={
    getDepartmentData,
    deleteDepartmentByDepId
}