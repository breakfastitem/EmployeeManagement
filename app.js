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
        });
    });
}



function menuPrompt() {
    //Initial menu prompt
    inquirer.prompt([{
        type: "list",
        message: "What Would You Like to Do.",
        choices: ["View All Employees", "View All departments", "View All roles", "Add department"],
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
                });
                break;
            case "View All departments":
                connection.query("SELECT * FROM department", (err, res) => {
                    if (err) throw err;
                    console.table(res);

                });
                break;

            case "View All roles":
                connection.query(`
            SELECT  
            * 
            FROM role
             LEFT JOIN department ON role.department_id= department.id;`, (err, response) => {
                    if (err) throw err;

                    let table = [];
                    for (let i = 0; i < response.length; i++) {
                        let role = { id: i + 1 };
                        role.title = response[i].title;
                        role.salary = response[i].salary;
                        role.department = response[i].name;
                        table.push(role);
                    }
                    console.table(table);

                });
                break;
            case "Add department":
                addDepartment();
                break;
        }

    });
};

/**
 * Main
 */
menuPrompt();
