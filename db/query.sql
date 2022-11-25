--View all Departments
SELECT * FROM t_department

--View all t_roles
SELECT * FROM t_roles

--View all Employees
SELECT * FROM t_employee

---------------------------------

--Add a Departments
INSERT INTO t_department (department_name)
VALUES (variable);

--Add a Role
INSERT INTO t_roles (title, salary, department_id)
VALUES (salary, salary, depto_id);

--Add an Employee
INSERT INTO t_employee (first_name, last_name, role_id, manager_id)
VALUES (name, last_name, role_id, manager_id);


--Update an Employee Role
UPDATE t_employee
SET role_id = newRole
WHERE id = employee_id;

--Update the employee managers
UPDATE t_employee
SET manager_id = newManager
WHERE id = EmployeeId;

--View employees by Manager
SELECT * FROM t_employee
WHERE manager_id = ManagerId;

--View employees by Department
SELECT * FROM t_employee
WHERE department_id = DeptoId;

--Delete Departments, Roles, and Employees
DELETE FROM t_department WHERE id=deptoId;

DELETE FROM t_roles WHERE id=roleId;

DELETE FROM t_employee WHERE id=employeeId;

--View the total utilized budget of a department—in other words, the combined salaries of all employees in that department (8 points).

SELECT SUM(t_roles.salary) FROM
t_roles
JOIN t_department
ON t_roles.department_id = t_department.id;
