var express = require('express');
var router = express.Router();

const dataLayer = require("companydata");

/**
 * GET_TIMECARDS
 * 
 * @param emp_id
 * @return json 
 */
router.get('/', function (req, res, next) {
    let emp_id = req.query.emp_id;

    let checkForEmployeeID = dataLayer.getEmployee(emp_id); 

    //checking if there is an existing employee ID
    if (checkForEmployeeID === null) {
        res.json("ERROR: Employee doesn't exist in a database.");
    }

    let timecards = dataLayer.getAllTimecard(emp_id);
    res.json(timecards);
});

module.exports = router;


