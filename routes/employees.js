var express = require('express');
var router = express.Router();

const dataLayer = require("companydata");

/**
 * GET_EMPLOYEES
 * 
 * @param company
 * @return json 
 */
router.get('/', function (req, res, next) {
    let employees = dataLayer.getAllEmployee(req.query.company);

    //checking if the Employee list is empty
    if(employees.length === 0) {
        res.json("Error: No records found. Either the company name is wrong or there are no employees for that department.");
    }

    res.json(employees);
});

module.exports = router;
 