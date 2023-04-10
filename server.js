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
    db.query("SELECT * FROM Roles", (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
    
}

const viewEmployee = () => {
    db.query(`SELECT * FROM Employee`, (err, results) => {
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
        db.query(`INSERT INTO Department (name) 
         VALUES(?)`, answers.addDept, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                db.query(`SELECT * FROM Department`, (err, results) => {
                    err ? console.error(err) : console.table(results);
                    init();
                })
            }
        })
    })
};
const addRoles = () => {
    
    db.promise().query(`SELECT * FROM Department`)
    .then((rows) => {
         let arrNames = rows[0].map(obj => ({name: obj.Department_name, value:obj.id}));
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
             db.promise().query("INSERT INTO Roles set ?", answers).then(data => {
                 console.log("added role");
                 init()
             })
         })
    })

    
}


const addEmployee = () => {

    let roleIds = [];
    let roleNames = [];

    let managerIds = [];
    let managerNames = [];

    function prepareRoleChoices(nextFunctionCall, nextNextFunctionCall) {
        db.query(`SELECT id,title FROM Roles`, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                roleNames = results.map(res=>res.title)
                roleIds = results.map(res=>res.id)
                // console.log(roleNames);
                // console.log(roleIds);
                // process.exit(0);
                nextFunctionCall(nextNextFunctionCall);
            }
        });
    }

    function prepareManagerChoices(nextNextFunctionCall) {
        db.query(`SELECT id, CONCAT(first_name, " ", last_name) as manager_name FROM Employee`, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                managerNames = results.map(res=>res.manager_name)
                managerIds = results.map(res=>res.id)
                // console.log(managerNames);
                // console.log(managerIds);
                // process.exit(0);
                nextNextFunctionCall();
            }
        });
    }

    prepareRoleChoices(prepareManagerChoices, askAndUpdateDatabase)

    function askAndUpdateDatabase() {
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
                type: "list",
                choices: roleNames,
                message: "What is this employees role?",
                name:"role"
            },
            {
                type: "list",
                choices: managerNames,
                message: "Who is the manager of this employee?",
                name: "manager"
            }
        
        ]).then(answers => {
            let selectedRoleName = answers.role;
            let selectedRoleId = roleNames.indexOf(selectedRoleName);
            // ["a","b","c"].indexOf("b") => 1

            let selectedManagerName = answers.manager;
            let selectedManagerId = managerNames.indexOf(selectedManagerName);
            // ["a","b","c"].indexOf("c") => 2

            // console.log({selectedRoleName,selectedManagerName});
            // console.log({selectedRoleId,selectedManagerId});

            db.query(`INSERT INTO Employee(first_name, last_name, role_id, manager_id)
            VALUES(?, ?, ?, ?)`, [answers.firstName, answers.lastName, selectedRoleId, selectedManagerId], (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    db.query(`SELECT * FROM Employee`, (err, results) => {
                        err ? console.error(err) : console.table(results);
        
                        init();
                    })
                }
            })
        })
    }
}

const updateEmployee = () => {

    db.query(
        `SELECT * FROM roles`,
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
                db.query(`UPDATE employee SET roles_id = ? WHERE id = ?`, [answers.role_id, answers.roles], (err, results) => {
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