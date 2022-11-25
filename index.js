
require('dotenv').config();
const fs = require('fs');
const inquirer = require('inquirer');

const express = require('express');

// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password
    password: process.env.DB_PASSWORD,
    database: 'office_db'
  },
  console.log(`Connected to the office_db database.!!!!!!!`)
);



/**
 * Recursive prompt example
 * Allows user to choose when to exit prompt
 */

 const output = [];
 
const questions = [
   {
      type: 'rawlist',
      name: 'menu',
      message: 'What do you want to do?',
      choices: [
         'View All Employees',
         'Add Employees',
         new inquirer.Separator(),
         'Update Employee Role',
         'View All Roles',
         'Add Role',
         new inquirer.Separator(),
         'View All Departments',
         'Add Department',
         new inquirer.Separator(),
         'Update Employee Manager',
         'View Wmployees by Managers',
         'View Employees by Department',
         'Delete a Department',
         'Delete a Role',
         'Delete an Employee',
         'View the Budget by Department',
         'Quit' 
      ],
   },
   
   
 ];
 
 function ask() {
   inquirer.prompt(questions).then((answers) => {
      output.push(answers.menu);
      if (answers.menu === 'View All Employees') {
         console.log("Inside all Employees Function");

         console.log("Query Database All Department");
         db.query('SELECT * FROM t_department', function (err, results) {
            //console.log(results);
            console.table(results);
         });
         output.push(questions);
      }else if (answers.menu === 'Add Employees') {
         console.log("Inside all Employees Function");

         console.log("Query Database All Department");
         db.query('SELECT * FROM t_department', function (err, results) {
            //console.log(results);
            console.table(results);
         });
         output.push(questions);
      }
      else if (answers.menu === 'Quit') {
         // if (answers.askAgain) {
         //    ask();
         // } else {
            console.log('You choose the following options. Thank you...', output.join(', '));
         //}
      }
   });
 }
 
 ask();