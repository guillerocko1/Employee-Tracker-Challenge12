INSERT INTO t_department (department_name) 
VALUES ("Sales"),
       ("Engineering"),
      ("Finance"),
      ("Legal");

INSERT INTO t_roles (title, salary, department_id)
VALUES 
   ("Sales Lead", 100000, 1),
   ("Salesperson", 80000, 1),
   ("Lead Engineer", 150000, 2),
   ("Software Engineer", 120000, 2),
   ("Account Manager", 160000, 3),
   ("Accountant", 125000, 3),
   ("Sales Lead", 100000, 1),
   ("Lawyer", 190000, 4);


INSERT INTO t_employee(first_name, last_name, role_id, manager_id)
VALUES 
   ("Joe", "Brown", 1, NULL),
   ("Liam", "Jackson", 4, 1),
   ("Michael", "Bouer", 3, 1),
   ("John", "Duggan", 2, 2),
   ("Elena", "Moore", 4, 2),
   ("Keani", "Solano", 5, NULL),
   ("Gabriel", "Hernandez", 6, 3);