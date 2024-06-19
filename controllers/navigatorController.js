const express = require('express');
const userService = require('../services/usersService');
const path = require('path');

const router = express.Router();

router.get('/', async (req, res) => {
    let headers = req.headers;
    console.log (headers);
    if (headers['redirect']=='departments')
    {
        res.sendFile(path.resolve('htmlPages/department.html'));
    }
    else if (headers['redirect']== 'employees')
    {
        res.sendFile(path.resolve('htmlPages/employeesPage.html'));
    }
    else 
    {
        res.sendFile(path.resolve('htmlPages/navigatorPage.html'))
    }

});

module.exports = router;