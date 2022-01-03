var express = require('express');
var router = express.Router();

const dataLayer = require("companydata");
const Employee = dataLayer.Employee;

/**
 * GET_EMPLOYEE
 * 
 * @param emp_id
 * @return json 
 */
router.get('/', function (req, res, next) {
    let employee = dataLayer.getEmployee(req.query.emp_id);

    //checking if employee exist in database
    if (employee == null) {
        res.json("ERROR: The employee doesn't exist, please enter existing Employee ID.")
    }
    res.json(employee); 
});

/**
 * INSERT_EMPLOYEE
 * 
 * @param emp_name
 * @param emp_no
 * @param hire_date
 * @param job
 * @param salary
 * @param dept_id
 * @param mng_id
 * @return json 
 */
router.post('/', function (req, res, next) {
    let emp_name = req.body.emp_name;
    let emp_no = req.body.emp_no;
    let hire_date = req.body.hire_date;
    let job = req.body.job;
    let salary = req.body.salary;
    let dept_id = req.body.dept_id;
    let mng_id = req.body.mng_id;

    let employee = new Employee(emp_name, emp_no, hire_date, job, salary, dept_id, mng_id);

    //checking if department ID exist in database
    if(dataLayer.getDepartment("dxb3501", dept_id) === null) {
        res.json("ERROR: Department ID doesn't exist.");
    }

    let listOfEmployees = dataLayer.getAllEmployee("dxb3501");

    //checking if the employee number already exists
    for (let i = 0; i < listOfEmployees.length; i++) {
        if (emp_no === listOfEmployees[i].getEmpNo()) {
            res.json("ERROR: Employee number already exists, please provide different employee number for the employee");
        }
    }

    let checkManagerEmployee = dataLayer.getEmployee(mng_id);
   
    //checking if manager ID exist in the previous records
    if (checkManagerEmployee === null) {
        res.json("ERROR: Manager doesn't exist, please provide right manager ID.")
        for (let i = 0; i < checkManagerEmployee.length; i++) {
            if (checkManagerEmployee === null || mng_id !== checkManagerEmployee[i].getMngId()) {
                res.json("ERROR: Manager under that number doesn't exist, please provide existing manager ID number.");
            }
        }
    }
    
    //checking the date validation input
    var date_regex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
        if (!(date_regex.test(hire_date))) {
        res.json("ERROR: The form of the date is not valid!");
    }
    
    let curDate = new Date();

    var userInputDate = hire_date.split("-");
    
    var dateValidation = new Date(userInputDate[0],userInputDate[1], userInputDate[2])

    //hire_date must be valid date equal to the current date or earlier
    if(dateValidation  > curDate) {
        res.json("ERROR: Hire date must not be greater than the current date.");
    }


    let result = dataLayer.insertEmployee(employee);
    res.json(result);
});

/**
 * Responds to PUT requests. The express.json() middleware is used (see app.js)
 * and it parses incoming requests with JSON payloads into a new 'body' object.
 * 
 * UPDATE_EMPLOYEE
 * 
 * @param emp_name
 * @param emp_no
 * @param hire_date
 * @param job
 * @param salary
 * @param dept_id
 * @param mng_id
 * @return json 
 */
router.put('/', function (req, res, next) {
    let emp_name = req.body.emp_name;
    let emp_no = req.body.emp_no;
    let hire_date = req.body.hire_date;
    let job = req.body.job;
    let salary = req.body.salary;
    let dept_id = req.body.dept_id;
    let mng_id = req.body.mng_id;
    let emp_id = req.body.emp_id;

    //checking if department ID is provided
    if (dept_id === 0 || dept_id === null) {
        res.json("ERROR: Please provide department ID.");
    }

    let checkForDepartment = dataLayer.getDepartment("dxb3501", dept_id);

    //checking if department ID exists
    if(checkForDepartment === null) {
        res.json("ERROR: Department ID doesn't exist. Please provide existing department ID.")
    }

    let checkForEmployeeID = dataLayer.getEmployee(emp_id); 

    //checking if there is an existing employee ID
    if (checkForEmployeeID === null) {
        res.json("ERROR: Employee doesn't exist in a database.")
    }

    let employee = new Employee(emp_name, emp_no, hire_date, job, salary, dept_id, mng_id);
    employee.setId(req.body.emp_id);
    let result = dataLayer.updateEmployee(employee);
    res.json(result);
});

/**
 * DELETE_EMPLOYEE
 * 
 * @param emp_id
 * @return json 
 */
router.delete('/', function (req, res, next) {
    let employee = dataLayer.getEmployee(req.query.emp_id);

    //checking if employee ID exist in database
    if (employee === null) {
        res.json("ERROR: The employee doesn't exist, please enter existing employee ID.")
    }

    const deleteEmployee = dataLayer.deleteEmployee(req.query.emp_id);

    res.json(deleteEmployee);
});

module.exports = router;
