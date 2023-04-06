DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;

USE employeesDB;

CREATE TABLE Department (
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Roles (
  title VARCHAR(30),
  salary DECIMAL(10,2),
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id)
  REFERENCES Department(id)
);

CREATE TABLE Employee (
  first_name VARCHAR(45),
  last_name VARCHAR(45),
  role_id INT,
  manager_id INT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id)
  REFERENCES Roles(id),
  FOREIGN KEY (manager_id)
  REFERENCES Employee(id)

);
