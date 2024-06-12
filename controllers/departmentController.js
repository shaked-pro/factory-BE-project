const express = require('express');
const { MongoClient } = require('mongodb');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const departmentService = require('../services/departmentService');
const commonUsage = require('../commonUsage');

const router = express.Router();

// the routs of the /departments
router.get('/', async (req, res) => {
    //here I will get all the departments from the db
    console.log("ToDo");
});

//the routs of the /departments/EditDepartment
router.get('/editDepartment', async (req, res) => {
    let headers = await req.headers;
    console.log(headers);
    if (headers['depname'] != null) {
        let departmentData = await departmentService.getDepartmentData(headers['depname']);
        if (departmentData != null) {
            res.send(departmentData);
        }
        else {
            console.log("wasn't able to het the relevant department in the controller");
        }
    }
    else {
        return res.sendFile(path.resolve('htmlPages/editDepartment.html'));
    }
})

router.delete('/editDepartment', async (req, res) => {
    let depid = await req.body.departmentid;
    console.log(req.body);
    console.log(depid)
    if (depid != null) {
        let success = await departmentService.deleteDepartmentByDepId(depid);
        res.send(true);
    }
    else {
        console.log("controller: department id was not sent!");
        res.send(false);
    }
})

module.exports = router;
