var express = require('express');
var router = express.Router();

const dataLayer = require("companydata");

/**
 * GET_DEPARTMENTS 
 * 
 * @param company
 * @return json 
 */
router.get('/', function (req, res, next) {
    let departments = dataLayer.getAllDepartment(req.query.company);
    
    //checking if the departments list is empty
    if(departments.length === 0) {
        res.json("Error: No records found. Either the company name is wrong or there are no departments for that company.");
    }

    //Printing the result in json format 
    res.json(departments);
});

module.exports = router;


