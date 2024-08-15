const express = require('express');
const path = require('path');
const fs = require('fs');


const departmentService = require('../services/departmentService');
const commonUsage = require('../commonUsage');

const router = express.Router();

// the routs of the /departments
router.get('/', async (req, res) => {
    let headers = await req.headers;
    console.log (headers);
    if (headers['referer']!=null && headers['referer'].includes('http://localhost:3000/departments'))
    {
        departments = await departmentService.getAllDepartmentsFromDB();
        res.send(departments);
    }
    else 
    {
        res.sendFile(path.resolve('htmlPages/department.html'));
    }
});

//the routs of the /departments/EditDepartment
router.get('/editDepartment',async (req,res)=>{
    console.log ("controller: got to the get request of the department data");
    console.log(req.query['department'])
    if (req.query['department']!=null)
        {
        let departmentData = await departmentService.getDepartmentDataById(req.query['department']);
            if (departmentData!=null)
                {
                    res.send( departmentData);
                }
            else 
            {
                console.log ("wasn't able to het the relevant department in the controller");
            }
        }
    else 
    {
        return res.sendFile(path.resolve('htmlPages/editDepartment.html'));
    }
})

router.delete('/editDepartment' , async(req,res)=>
{
    let depid = await req.body.departmentid;
    console.log (req.body);
    console.log (depid)
    if (depid!=null)
        {
            let success = await departmentService.deleteDepartmentByDepId(depid);
            res.send(true);
        }
    else 
    {
        console.log ("controller: department id was not sent!");
        res.send(false);
    }
})

router.put('/editDepartment' , async(req,res)=>{
    if (req.query['updateDepartmentId'])
    {
        console.log (req.body);
    }
})

module.exports = router;
