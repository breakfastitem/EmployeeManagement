USE employees_db;

INSERT INTO 
    department (name)
VALUES 
    ("Sales"),("Legal"),("Engineering"),("Finance");

INSERT INTO
    role (title,salary,department_id)
VALUES 
    ("Sales Lead",100000.30,1),
    ("Salesperson", 70000.15,1),
    ("Legal Team Lead",250000,2),
    ("Lawyer",120000.15,2),
    ("Lead Engineer",150000,3),
    ("Software Engineer",70000.15,3),
    ("Accountant",70000,4);

INSERT INTO
    employee (first_name,last_name,role_id,manager_id)
VALUES 
    ("John","Doe",1,NULL),
    ("Sam","Johnson",3,NULL),
    ("George","Washington",5,NULL),
    ("John","Adams",4,2),
    ("Thomas","Jefferson",6,3),
    ("James","Madison",7,NULL),
    ("Jim","Smith",2,1);
