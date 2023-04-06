const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
      host: 'localhost',
      user: "root",
      password: "Christopher917!!",
      database: "employeesDB",
    },
    console.log(`Connected to the employees_db database.`)
); 

const init = () => {
inquirer
.prompt([
    {
        type: "list",
        message: "Please choose an option:",
        name: "initialize",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Quit"
        ]
    }
    // add .then
]).then(answers => {
    switch (answers.initialize) {
        case "View all departments": viewDept();
            break;
        case "View all roles": viewRoles();
            break;
        case "View all employees": viewEmployee();
            break;
        case "Add a department": addDept();
            break;
        case "Add a role": addRoles();
            break;
        case "Add an employee": addEmployee();
            break;
        case "Update an employee role": updateEmployee();
            break;
        case "Quit": exitPrompt();
            console.log("Goodbye!");
            
    }
}).catch(err => console.error(err));

}


const viewDept = () => {
    db.query(`SELECT * FROM Department`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
}

const viewRoles = () => {
    db.query("SELECT Roles.title AS Roles, Roles.salary AS Salary, department.name AS Department FROM Roles JOIN department ON Roles.department_id = department.id;", (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
    
}

const viewEmployee = () => {
    db.query(`SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department_name, manager.last_name as manager FROM employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee manager on employee.manager_id = manager.id`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
}

const addDept = () => {
    inquirer
    .prompt([
        {
            type: "input",
            message: "What department would you like to add?",
            name:"addDept"
        }

    ]).then(answers => {
        db.query(`INSERT INTO department(department_name)
        VALUES(?)`, answers.addDept, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                db.query(`SELECT * FROM department`, (err, results) => {
                    err ? console.error(err) : console.table(results);
                    init();
                })
            }
        })
    })
};
const addRoles = () => {
    
    db.promise().query(`SELECT * FROM department`)
    .then((rows) => {
         let arrNames = rows[0].map(obj => ({name: obj.department_name, value:obj.id}));
         inquirer
         .prompt([
             {
                 type: "input",
                 message: "What role would you like to add?",
                 name:"title"
             },
             {
                 type: "input",
                 message: "What is the salary for this role?",
                 name:"salary"
             },
             {
                 type: "list",
                 message: "What department is this role assigned?",
                 name:"department_id",
                choices: arrNames
                 
     
             }
     
             
         ]).then(answers => {
             db.promise().query("INSERT INTO role set ?", answers).then(data => {
                 console.log("added role");
                 init()
             })
         })
    })

    
}


const addEmployee = () => {
    inquirer
    .prompt([
        {
            type: "input",
            message: "What is the first name of the employee would you like to add?",
            name:"firstName"
        },
        {
            type: "input",
            message: "What is the last name of the employee would you like to add?",
            name:"lastName"
        },
        {
            type: "input",
            message: "What is this employees role?",
            name:"role"
        },
        {
            type: "input",
            message: "Who is the manager of this employee?",
            name: "manager"
        }

        
    ]).then(answers => {
        db.query(`INSERT INTO employee(first_name, last_name)
        VALUES(?, ?)`, [answers.firstName, answers.lastName], (err, results) => {
            if (err) {
                console.log(err);
            } else {
                db.query(`SELECT * FROM employee`, (err, results) => {
                    err ? console.error(err) : console.table(results);
                    
                    init();
                })
            }
        })
    })
}

const updateEmployee = () => {
    db.query(
        `SELECT * FROM role`,
        function (err, res) {
            if (err) throw err;
            const roles = res;
            console.table(roles);

            inquirer
            .prompt([
                {
                    type: "input",
                    message: "Enter employee ID number",
                    name: "role_id"
                },
                {
                    type: "input",
                    message: "choose new employee role",
                    name: "roles"
                }
            ]).then(answers => {
                db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [answers.role_id, answers.roles], (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        db.query(`SELECT * FROM employee`, (err, results) => {
                            err ? console.error(err) : console.table(results);

                            init();
                        } )
                    }
                })
            })
        }

    )
    
    }
   

const exitPrompt = () => {
console.log("Thank you very much!");
}

init();