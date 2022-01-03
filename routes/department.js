var express = require('express');
var router = express.Router();

const dataLayer = require("companydata");
const Department = dataLayer.Department;

/**
 * GET_DEPARTMENTS 
 * 
 * @param company
 * @param dept_id
 * @return json 
 */
router.get('/', function (req, res, next) {
    let department = dataLayer.getDepartment(req.query.company, req.query.dept_id);
    //let listOfDepartmets = dataLayer.getAllDepartment(req.query.company);

    //checking if department ID exist in database
    if (department === null) {
        res.json("ERROR: The department doesn't exist, please enter existing department ID.")
    }
    res.json(department);
});

/**
 * INSERT_DEPARTMENT
 * 
 * @param company
 * @param dept_id
 * @param dept_no
 * @param location
 * @return json 
 */
router.post('/', function (req, res, next) {
    let company = req.body.company;
    let dept_name = req.body.dept_name;
    let dept_no = req.body.dept_no;
    let location = req.body.location;

    let listOfDepartmets = dataLayer.getAllDepartment(company);

    //checking if there is an exsiting department number in the previous department list
    for (let i = 0; i < listOfDepartmets.length; i++) {
        if (dept_no === listOfDepartmets[i].getDeptNo()) {
            res.json("ERROR: The department number already exists, please provide different number for new department.")
        }
    }

    let department = new Department(company, dept_name, dept_no, location);
    let result = dataLayer.insertDepartment(department);
    res.json(result);
});

/**
 * Responds to PUT requests. The express.json() middleware is used (see app.js)
 * and it parses incoming requests with JSON payloads into a new 'body' object.
 * 
 * UPDATE_DEPARTMENT
 * 
 * @param company
 * @param dept_id
 * @param dept_no
 * @param dept_name
 * @param location
 * @return json 
 */
router.put('/', function (req, res, next) {
    let company = req.body.company;
    let dept_name = req.body.dept_name;
    let dept_no = req.body.dept_no;
    let location = req.body.location;
    let dept_id = req.body.dept_id

    let department = new Department(company, dept_name, dept_no, location);

    let checkForDepartment = dataLayer.getDepartment(company, dept_id);

    //checking if department ID is provided
    if (dept_id === 0) {
        res.json("ERROR: Please provide department ID.");
    }

    //checking if department ID exists
    if(checkForDepartment === null) {
        res.json("ERROR: Department ID doesn't exist. Please provide existing department ID.")
    }

    let listOfDepartmets = dataLayer.getAllDepartment(company);
   
    //checking if there is an exsiting department number in the previous department list
    for (let i = 0; i < listOfDepartmets.length; i++) {
        if (dept_no === listOfDepartmets[i].getDeptNo()) {
            res.json("ERROR: The department number already exists, please provide different number for new department.");
        }
    }

    department.setDeptId(req.body.dept_id);
    let result = dataLayer.updateDepartment(department);
    res.json(result);
});

/**
 * DELETE_DEPARTMENT - will also delete all the employees connected to the department
 *  
 * @param company
 * @param dept_id
 * @return json 
 */
router.delete('/', function (req, res, next) {
    let department = dataLayer.getDepartment(req.query.company, req.query.dept_id);
    let employees = dataLayer.getAllEmployee(req.query.company);

    //checking if department ID exist in database
    if (department === null) {
        res.json("ERROR: The department doesn't exist, please enter existing department ID.")
    }

    employees.forEach(employee => {
        if (employee.dept_id === parseInt(req.query.dept_id) ) {
           dataLayer.deleteEmployee(employee.emp_id);
        }
    });

    const deleteDepartment = dataLayer.deleteDepartment(req.query.company, req.query.dept_id);

    res.json(deleteDepartment);
});

module.exports = router;
