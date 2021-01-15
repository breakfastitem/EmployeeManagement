//import dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const dotenv =require("dotenv");

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

connection.query("SELECT * FROM department",(err,response)=>{
    if(err) throw err;

    console.table(response);

    connection.end();
});