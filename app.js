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

//Initial menu prompt
inquirer.prompt([{
    type: "list",
    message: "What Would You Like to Do.",
    choices: ["View All Employees"],
    name: "funct"
}]).then((answers) => {

    switch (answers.funct) {
        case "View All Employees":
           connection.query(`
                SELECT 
                    *
                FROM role

                RIGHT JOIN employee ON employee.role_id= role.id
                INNER JOIN department ON role.department_id=department.id;`, (err, response) => {
                if (err) throw err;
                let table = [];
                for (let i = 0; i < response.length; i++) {
                    let employee = { id: i + 1 };
                    employee.first_name = response[i].first_name;
                    employee.last_name = response[i].last_name;
                    employee.title = response[i].title;
                    employee.department = response[i].name;
                    if (response[i].manager_id) {
                        employee.manager = response[response[i].manager_id - 1].first_name + " " + response[response[i].manager_id - 1].last_name;
                    } else {
                        employee.manager = "NULL";
                    }
                    table.push(employee);
                }
                console.table(table);

            });
            break;
    }




}

);
