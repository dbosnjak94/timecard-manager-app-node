var express = require('express');
var router = express.Router();

const dataLayer = require("companydata");
const Timecard = dataLayer.Timecard;

/**
 * GET_TIMECARD
 * 
 * @param timecard_id
 * @return json 
 */
router.get('/', function (req, res, next) {
    let timecard = dataLayer.getTimecard(req.query.timecard_id);
    res.json(timecard); 
});

/**
 * INSERT_TIMECARD
 * 
 * @param emp_id
 * @param start_time
 * @param end_time
 * @return json 
 */
router.post('/', function (req, res, next) {
    let emp_id = req.body.emp_id;
    let start_time = req.body.start_time;
    let end_time = req.body.end_time;

    let checkForEmployeeID = dataLayer.getEmployee(emp_id); 

    //checking if there is an existing employee ID
    if (checkForEmployeeID === null) {
        res.json("ERROR: Employee doesn't exist in a database.")
    }

    let timecard = new Timecard(start_time, end_time, emp_id);
    let result = dataLayer.insertTimecard(timecard);
    res.json(result);
});

/**
 * UPDATE_TIMECARD
 * 
 * @param start_time
 * @param end_time
 * @param emp_id
 * @return json 
 */
router.put('/', function (req, res, next) {
    let start_time = req.body.start_time;
    let end_time = req.body.end_time;
    let emp_id = req.body.emp_id;
    let timecard_id = req.body.timecard_id
    
    let timecard = new Timecard(start_time, end_time, emp_id);

    let checkForEmployeeID = dataLayer.getEmployee(emp_id); 

    //checking if there is an existing employee ID
    if (checkForEmployeeID === null) {
        res.json("ERROR: Employee doesn't exist in a database.")
    }

    let checkForTimecardID = dataLayer.getTimecard(timecard_id);

     //checking if there is an existing timecard ID
     if (checkForTimecardID === null) {
        res.json("ERROR: Timecard doesn't exist in a database.")
    }

    timecard.setId(req.body.timecard_id);
    let result = dataLayer.updateTimecard(timecard);
    res.json(result);
});

/**
 * DELETE_TIMECARD
 * 
 * @param timecard_id
 * @return json 
 */
router.delete('/', function (req, res, next) {
    let timecard = dataLayer.getTimecard(req.query.timecard_id);

    //checking if timecard ID exist in database
    if (timecard === null) {
        res.json("ERROR: The timecard doesn't exist, please enter existing employee ID.")
    }

    const deleteTimecard = dataLayer.deleteTimecard(req.query.timecard_id);

    res.json(deleteTimecard);
});

module.exports = router;
