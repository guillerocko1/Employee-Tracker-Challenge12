// Put at the top to set up the .env file
require("dotenv").config();
const fs = require("fs");
const inquirer = require("inquirer");

const express = require("express");

// Import and require mysql2
const mysql = require("mysql2");
const { markAsUntransferable } = require("worker_threads");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the database.`)
);

menu();

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What do you want to do?",
        choices: [
          {
            name: "View All Employees",
            value: "VIEW_EMPLOYEES",
          },
          {
            name: "View All Employees by Department",
            value: "VIEW_ALL_EMPLOYEES_BY_DEPARTMENT",
          },
          {
            name: "View All Employees By Manager",
            value: "VIEW_EMPLOYEES_BY_MANAGER",
          },
          {
            name: "Add Employee",
            value: "ADD_EMPLOYEE",
          },
          {
            name: "Remove Employee",
            value: "REMOVE_EMPLOYEE",
          },
          {
            name: "Update Employee Role",
            value: "UPDATE_EMPLOYEE_ROLE",
          },
          // {
          //   name: "Update Employee Manager",
          //   value: "UPDATE_EMPLOYEE_MANAGER",
          // },
          {
            name: "View All Roles",
            value: "VIEW_ROLES",
          },
          {
            name: "Add Role",
            value: "ADD_ROLE",
          },
          {
            name: "Remove Role",
            value: "REMOVE_ROLE",
          },
          {
            name: "View All Departments",
            value: "VIEW_DEPARTMENTS",
          },
          {
            name: "Add Department",
            value: "ADD_DEPARTMENT",
          },
          {
            name: "Remove Department",
            value: "REMOVE_DEPARTMENT",
          },
          {
            name: "View Total Utilized Budget By Department",
            value: "VIEW_BUDGET_BY_DEPARTMENT",
          },
          {
            name: "Quit",
            value: "QUIT",
          },
        ],
      },
    ])
    .then((res) => {
      let choice = res.choice;
      switch (choice) {
        case "VIEW_EMPLOYEES":
          view_employee();
          break;
        case "VIEW_ALL_EMPLOYEES_BY_DEPARTMENT":
          view_employee_by_department();
          break;
        case "VIEW_EMPLOYEES_BY_MANAGER":
          view_employee_by_manager();
          break;
        case "ADD_EMPLOYEE":
          add_employee();
          break;
        case "REMOVE_EMPLOYEE":
          remove_employee();
          break;
        case "UPDATE_EMPLOYEE_ROLE":
          update_role();
          break;
        // case "UPDATE_EMPLOYEE_MANAGER":
        //   update_employee_manager();
        //   break;
        case "VIEW_ROLES":
          view_roles();
          break;
        case "ADD_ROLE":
          add_role();
          break;
        case "REMOVE_ROLE":
          remove_role();
          break;
        case "VIEW_DEPARTMENTS":
          view_department();
          break;
        case "ADD_DEPARTMENT":
          add_department();
          break;
        case "REMOVE_DEPARTMENT":
          remove_department();
          break;
        case "VIEW_BUDGET_BY_DEPARTMENT":
          view_budget_by_department();
          break;
        default:
          process.exit();
      }
    });
}

function view_employee() {
  

    console.log("Inside View Employees Function");

    console.log("Query Database ");
    db.query(`SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Name, r.title, d.department_name, r.salary, manager_id AS Manager
    FROM t_employee e
    LEFT JOIN t_roles r
      ON e.role_id = r.id
    LEFT JOIN t_department d
      ON r.department_id = d.id
    ORDER BY 1;`, function (err, results) {
      console.table(results);
      menu();
    });
    
}

async function view_employee_by_department() {

  const [emp] = await db.promise().query("SELECT * FROM t_department");
  const emp_array = emp.map((e) => ({
    name: e.department_name,
    value: e.id,
  }));
  
  inquirer
    .prompt([
      {
        type: "list",
        name: "department_id",
        message: "Enter the Department id: ",
        choices: emp_array
      },
    ])
    .then((res) => {
      console.log("Query Database All Department");
      db.query(`SELECT * FROM t_employee where id = ${res.department_id}`,
        function (err, results) {
          //console.log(results);
          console.table(results);
          menu();
        });
    })
}

async function view_employee_by_manager() {

   const [emp] = await db.promise().query("SELECT * FROM t_employee");
  const emp_array = emp.map((e) => ({
    name: e.first_name + " " + e.last_name,
    value: e.id,
  }));
   
  
  console.log("Inside view employee by manager");
  inquirer
    .prompt([
      {
         type: "list",
         name: "manager_id",
         message: "Select the Employee Manager: ",
         choices: emp_array,
       },
    ])
    .then((res) => {
      console.log("Query Database All Department");
      db.query(
        `SELECT * FROM t_employee where manager_id = ${res.manager_id}`,
        function (err, results) {
          //console.log(results);
          console.table(results);
          menu();
        }
      );
    });
}

async function add_employee() {
  const [roles] = await db.promise().query("SELECT * FROM t_roles");
  const role_array = roles.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  const [emp] = await db.promise().query("SELECT * FROM t_employee");
  const emp_array = emp.map((e) => ({
    name: e.first_name + " " + e.last_name,
    value: e.id,
  }));

  console.log("Inside Add employee");
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter First Name: ",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter Last Name: ",
      },
      {
        type: "list",
        name: "role_id",
        message: "Please select the Role:  ",
        choices: role_array,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Select the Employee Manager: ",
        choices: emp_array,
      },
    ])
    .then((answer) => {
      const empobj = {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: answer.role_id,
        manager_id: answer.manager_id,
      };

      
      db.promise()
        .query(`INSERT INTO t_employee SET ?`, empobj)
         .then(() => view_employee());
       //menu();
    });
}

async function remove_employee() {
  const [emp] = await db.promise().query("SELECT * FROM t_employee");
  const emp_array = emp.map((e) => ({
    name: e.first_name + " " + e.last_name,
    value: e.id,
  }));

  //`SELECT department_name FROM t_department`;
  console.log("Inside remove employee");
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee_id",
        message: "Select the employee that you would like to remove:  ",
        choices: emp_array,
      },
    ])
    .then((delete_emp) => {
      db.query(
        `DELETE FROM t_employee WHERE id = ${delete_emp.employee_id}`,
        function (err, results) {
          console.log("Employee deleted...");
          view_employee();
          menu();
          //console.table(results);
        }
      );
    })
}

function view_roles() {

    console.log("Query Database ");
    db.query("SELECT * FROM t_roles", function (err, results) {
      console.table(results);
      menu();
    });
  
}

async function update_role() {

  const [roles] = await db.promise().query("SELECT * FROM t_roles");
  const role_array = roles.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  const [emp] = await db.promise().query("SELECT * FROM t_employee");
  const emp_array = emp.map((e) => ({
    name: e.first_name + " " + e.last_name,
    value: e.id,
  }));
  
  //console.log("Inside update Role");
  inquirer
    .prompt([
      {
        type: "list",
        name: "emp_id",
        message: "What Employee's role would you like to update?:  ",
        choices: emp_array,
      },
      {
        type: "list",
        name: "role_id",
        message: "What role do you want to assign the selected employee?:  ",
        choices: role_array,
      },
    ])
    .then((respond) => {
      //console.log("Query Database delete employee");
      db.query(
        `UPDATE t_employee
      SET role_id=${respond.role_id} WHERE id = ${respond.emp_id}`,
        function (err, results) {
          console.log(`Employee's role Updated...`);
          menu();
        }
      );  
    })
}

async function add_role() {

  const [deptos] = await db.promise().query("SELECT * FROM t_department");
  const depto_array = deptos.map((depto) => ({
    name: depto.department_name,
    value: depto.id,
  }));

  
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the role: ",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role: ",
      },
      {
        type: "list",
        name: "department_id",
        message: "Which Department Does the role belong to? :  ",
        choices: depto_array,
      },
    ])
    .then((answer) => {
      const role_obj = {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.department_id,
      };

      
      db.promise()
        .query(`INSERT INTO t_roles SET ?`, role_obj)
         .then(() => view_roles());
       //menu();
    });
}

async function remove_role() {
  const [roles] = await db.promise().query("SELECT * FROM t_roles");
  const role_array = roles.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  //`SELECT department_name FROM t_department`;
  console.log("Inside remove role");
  inquirer
    .prompt([
      {
        type: "list",
        name: "role_id",
        message: "Select the Role that you would like to remove:  ",
        choices: role_array,
      },
    ])
    .then((delete_role) => {
      db.query(
        `DELETE FROM t_roles WHERE id = ${delete_role.role_id}`,
        function (err, results) {
          console.log("Role deleted...");
          view_roles();
          //menu();
          //console.table(results);
        }
      ); 
    }) 
}

function view_department() {

  console.log("View All Departments ");
  db.query("SELECT * FROM t_department", function (err, results) {
    console.table(results);
    menu();
  });

}


async function add_department() {
  
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: "What is the name of the Department: ",
      },
    ])
    .then((answer) => {
      const department_obj = {
        department_name: answer.department_name,
      };
      db.promise()
        .query(`INSERT INTO t_department SET ?`, department_obj)
         .then(() => view_department());
       //menu();
    });
}


async function remove_department() {

  const [deptos] = await db.promise().query("SELECT * FROM t_department");
  const department_array = deptos.map((depto) => ({
    name: depto.department_name,
    value: depto.id,
  }));

  //`SELECT department_name FROM t_department`;
  console.log("Inside remove role");
  inquirer
    .prompt([
      {
        type: "list",
        name: "department_id",
        message: " What Department would you like to remove:  ",
        choices: department_array,
      },
    ])
    .then((delete_role) => {
      db.query(
        `DELETE FROM t_department WHERE id = ${delete_role.department_id}`,
        function (err, results) {
          console.log("Department deleted...");
          view_department();
          //menu();
          
        });
    });
}
  

async function view_budget_by_department() {

  const [emp] = await db.promise().query("SELECT * FROM t_department");
  const emp_array = emp.map((e) => ({
    name: e.department_name,
    value: e.id,
  }));
  
  inquirer
    .prompt([
      {
        type: "list",
        name: "department_id",
        message: "Enter the Department id: ",
        choices: emp_array
      },
    ])
    .then((res) => {
      console.log("Query Database All Department");
      db.query(`SELECT department_id AS Depart_ID, (SELECT department_name 
        FROM t_department WHERE id=${res.department_id}) AS Depart_Name, SUM(salary) AS BUDGET
      FROM t_roles 
      WHERE department_id = ${res.department_id}
      GROUP BY 1`,
        function (err, results) {
          //console.log(results);
          console.table(results);
          menu();
        });
    })
}

  

