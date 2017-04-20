// Dependency Loading and Global Variables
const mysql = require('mysql'),
    Table = require('cli-table'),
    inquirer = require('inquirer'),
    chalk = require('chalk');

// initialize the following variables
let itemQty;


// function to clear the current CLI screen
console.reset = function () {
    return process.stdout.write('\033c');
};


// MySQL connection parameters
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
});


// Function to render products table,
//  create Table - setup structure and headers
let renderTable = function (res) {
    let table = new Table(
        {
            head: ['Dept ID', 'Department Name', 'Overhead Costs', 'Total Sales', 'Total Profit'],
            colAligns: [null, null, 'right', 'right', 'right'],
            colWidths: [9, 25, 16, 13, 14],
            chars: {
                'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
                'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚',
                'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─',
                'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│'
            },
            style: {head: ['cyan'], border: ['grey']},
        });
    // Push each product ID, Name & Price to the table
    for (i in res) {
        let row = [];
        row.push(res[i].department_id);
        row.push(res[i].department_name);
        row.push(res[i].over_head_costs);
        row.push(res[i].product_sales);
        row.push(res[i].total_profit);
        table.push(row);
        // set item qty for input validation
        itemQty = table.length;
    }
    // Clear screen and display table
    console.reset();
    console.log('\n' + table.toString() + '\n');
};


// Manager Interface function
let supervisorInterface = function () {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View Product Sales by Department', 'Create New Department', 'Exit'],
            name: 'choice'

        }
    ]).then(function (data) {
        switch (data.choice) {
            case 'View Product Sales by Department':
                connection.query('SELECT *, ROUND(`product_sales`-`over_head_costs`, 2) AS `total_profit` FROM `departments`', function (err, res) {
                    if (err) throw err;
                    renderTable(res);
                    supervisorInterface();
                });
                break;
            case 'Create New Department':
                addDepartment();
                break;
            default:
                console.reset();
                connection.end();
                console.log(chalk.cyan('Good Bye'));
        }
    });
};


// Add Department function
let addDepartment = function () {
    inquirer.prompt([
        {
            name: 'name',
            message: `What is the name of the new department? `,
        },
    ]).then(function (data) {
        connection.query('INSERT INTO `departments` SET ?', {
            department_name: data.name,
        }, function (err, res) {
            if (err) throw err;
            // update table to reflect changes made
            connection.query('SELECT * FROM `departments`', function (err, res) {
                if (err) throw err;
                renderTable(res);
                supervisorInterface();
            });
        })
    })
};


console.reset();
supervisorInterface();



