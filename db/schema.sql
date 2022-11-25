DROP DATABASE IF EXISTS office_db;
CREATE DATABASE office_db;

USE office_db;

CREATE TABLE t_department (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   department_name VARCHAR(30)
);

CREATE TABLE t_roles (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   title VARCHAR(30) NOT NULL,
   salary DECIMAL,
   department_id INT,
   FOREIGN KEY (department_id)
   REFERENCES t_department(id)
   ON DELETE SET NULL
);


CREATE TABLE t_employee (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   first_name VARCHAR(30) NOT NULL,
   last_name VARCHAR(30) NOT NULL,
   role_id INT,
   manager_id INT,
   FOREIGN KEY (role_id)
   REFERENCES  t_roles(id)
   ON DELETE SET NULL,
   FOREIGN KEY (manager_id)
   REFERENCES t_employee(id)
   ON DELETE SET NULL
);