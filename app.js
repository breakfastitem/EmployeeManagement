//import dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const dotenv = require("dotenv");

//Configure env file
dotenv.config();

//Establish mysql connection to database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.PASSWORD,
    database: "employees_db"
});

function addDepartment() {
    inquirer.prompt([{
        type: "input",
        message: "What is the new department name?",
        name: "department"
    }]).then((answers) => {
        connection.query(`INSERT INTO department (name)
        VALUES (?)`, [answers.department], (err) => {
            if (err) throw err;
            menuPrompt();
        });
    });
}

function addRole(){
    connection.query(`SELECT department.name FROM department;`,(err,response) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the new role name?",
                    name: "role"
                },
                {
                    type: "input",
                    message: "What is the new role salary?",
                    name: "salary"
                },
                {
                    type: "list",
                    message: "Which department is this role in?",
                    choices: [...response] ,
                    name: "department"
                }
           ]).then((answers) => {
                connection.query("INSERT INTO role (title,salary,department_id) SELECT ?,?, department.id FROM department WHERE ?=department.name;",
                [answers.role,answers.salary,answers.department ],(err)=>{
                    if (err) throw err;
                    menuPrompt();
                });
            });

        });
   
}

function addEmployeee(){

    connection.query("SELECT role.title AS name FROM role;",(err,roles) => {
        if (err) throw err;
        connection.query("SELECT CONCAT(employee.id,' ',employee.first_name,' ',employee.last_name) AS name FROM employee;", (err,managers)=>{
            if (err) throw err;
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the new employees first Name?",
                    name: "first"
                },
                {
                    type: "input",
                    message: "What is the new employees last Name?",
                    name: "last"
                },
                {
                    type: "list",
                    message: "Which role is this employee in?",
                    choices: [...roles] ,
                    name: "role"
                },
                {
                    type: "list",
                    message: "Who is this employees manager?",
                    choices: ["null",...managers] ,
                    name: "manager"
                }
           ]).then((answers) => {
               if(answers.manager=="null"){
                connection.query(`INSERT INTO employee (first_name,last_name,manager_id,role_id) 
                SELECT ? ,? ,NULL, role.id 
                FROM role
                WHERE ?=role.title;`,
                [answers.first,answers.last,answers.role],(err)=>{
                    if (err) throw err;
                    menuPrompt();
                });
               }else{
        
                   connection.query(`INSERT INTO employee (first_name,last_name,manager_id,role_id) 
                   SELECT ? ,? ,employee.id , role.id 
                   FROM employee
                   INNER JOIN role ON ?=role.title
                   WHERE  ?=employee.id;`,
                   [answers.first,answers.last,answers.role,answers.manager.split(" ")[0]],(err)=>{
                       if (err) throw err;
                       menuPrompt();
                   });
               }
               
            });

        });
       
    });
        
}

function updateEmployeeRole(){
    connection.query("SELECT role.title AS name FROM role;",(err,roles) => {
        if (err) throw err;
        connection.query("SELECT CONCAT(employee.id,' ',employee.first_name,' ',employee.last_name) AS name FROM employee;", (err,employees)=>{
            if (err) throw err;
            inquirer.prompt([
                {
                    type: "list",
                    message: "Which employee is being updated?",
                    choices: [...employees] ,
                    name: "employee"
                },
                {
                    type: "list",
                    message: "Which role is this employee in?",
                    choices: [...roles] ,
                    name: "role"
                },
                
           ]).then((answers)=>{
               connection.query(`UPDATE employee
               INNER JOIN role ON ?=role.title
                SET employee.role_id=role.id
                WHERE ?=employee.id;
               `,[answers.role,answers.employee.split(" ")[0]],(err)=>{
                if(err) throw err;
                menuPrompt();
               });

           });
        });

    });

}



function menuPrompt() {
    //Initial menu prompt
    inquirer.prompt([{
        type: "list",
        message: "What Would You Like to Do.",
        choices: ["View All Employees", "View All departments", "View All roles", "Add department","Add Role","Add Employee","Update Employee Role","Exit"],
        name: "funct"
    }]).then((answers) => {

        switch (answers.funct) {
            case "View All Employees":
                connection.query(`
                SELECT t1.id, t1.first_name, t1.last_name, role.title, department.name, role.salary, CONCAT(t2.first_name," ",t2.last_name) AS manager FROM employee t1
                INNER JOIN role ON t1.role_id =role.id
                INNER JOIN department ON role.department_id=department.id
                LEFT JOIN employee t2 ON t1.manager_id =t2.id;`, (err, response) => {
                    if (err) throw err;   
                    console.table(response);

                    menuPrompt();
                });
                break;
            case "View All departments":
                connection.query("SELECT * FROM department", (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    menuPrompt();
                });
                break;

            case "View All roles":
                connection.query(`SELECT  role.id,role.title,role.salary,department.name AS department FROM role
                INNER JOIN department ON role.department_id= department.id;`, (err, response) => {
                    if (err) throw err;
                    console.table(response);
                    menuPrompt();
                });
                break;
            case "Add department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployeee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Exit":
                connection.end();
                break;
        }

    });
};

/**
 * Main
 */
menuPrompt();
