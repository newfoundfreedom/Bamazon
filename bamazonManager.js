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
            head: ['Item #', 'Description', 'Price', 'Quantity'],
            colAligns: [null, null, null, 'right'],
            colWidths: [8, 50, 7, 10],
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
        row.push(res[i].id);
        row.push(res[i].product_name);
        row.push(res[i].price);
        row.push(res[i].stock_quantity)
        table.push(row);
        // set item qty for input validation
        itemQty = table.length;
    }
    // Clear screen and display table
    console.reset();
    console.log('\n' + table.toString() + '\n');
};


// Manager Interface function
let managerInterface = function () {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
            name: 'choice'

        }
    ]).then(function (data) {
        switch (data.choice) {
            case 'View Products for Sale':
                connection.query('SELECT * FROM `products`', function (err, res) {
                    if (err) throw err;
                    renderTable(res);
                    managerInterface();
                });
                break;
            case 'View Low Inventory':
                connection.query('SELECT * FROM `products` WHERE `stock_quantity`<=10', function (err, res) {
                    if (err) throw err;
                    renderTable(res);
                    managerInterface();
                });
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
            default:
                console.reset();
                connection.end();
                console.log(chalk.cyan('Good Bye'));
        }
    });
};


// Add Inventory function
let addInventory = function () {
    //First show current Product Inventory
    connection.query('SELECT * FROM `products`', function (err, res) {
        if (err) throw err;
        renderTable(res);
        // Prompt the manager for item they would like to add more inventory to
        //  validating their response against the number of items available
        inquirer.prompt([
            {
                name: 'number',
                message: `Enter the Item # for the product which you'd like to add inventory: `,
                validate: function (value) {
                    if (value > 0 && value <= itemQty) {
                        return true;
                    } else {
                        return 'Please enter a valid product id';
                    }
                }
            }

        // once an item has been selected, prompt manager for quantity to add
        // Validate their response to only allow integers
        ]).then(function (item) {
            inquirer.prompt({
                name: 'quantity',
                message: 'How many units would you like to add?',
                validate: function (value) {
                    let pass = value.match(/^\d/);
                    if (pass) {
                        return true;
                    }
                    return 'Please enter a valid quantity';
                }
            }).then(function (manager) {
                // Query the DB for item selected
                connection.query('SELECT * FROM `products` WHERE id=?', [item.number], function (err, res) {
                    if (err) throw err;
                    // Calculate what the new quantity will be
                    let newQty = (res[0].stock_quantity + parseInt(manager.quantity));
                    // Query the DB for item selected
                    connection.query('UPDATE products SET ? WHERE ?',
                        [
                            {stock_quantity: newQty},
                            {id: item.number}
                        ]
                        , function (err, res) {
                            if (err) throw err;
                            // update table to reflect changes made to quantities
                            connection.query('SELECT * FROM `products`', function (err, res) {
                                if (err) throw err;
                                renderTable(res);
                                managerInterface();
                            });
                        })
                })
            })
        })
    });
};

// Add Inventory function
let addProduct = function () {
    inquirer.prompt([
        {
            name: 'name',
            message: `What is the name/description of item to add? `,
        },
        {
            name: 'dept',
            message: `What department does it belong to?`
        },
        {
            name: 'price',
            message: `What's the price?`
        },
        {
            name: 'qty',
            message: `How many units to stock?`
        }
    ]).then(function (data) {
        connection.query('INSERT INTO `products` SET ?', {
            product_name: data.name,
            department_name: data.dept,
            price: data.price,
            stock_quantity: data.qty
        }, function (err, res) {
            if (err) throw err;
            // update table to reflect changes made to quantities
            connection.query('SELECT * FROM `products`', function (err, res) {
                if (err) throw err;
                renderTable(res);
                managerInterface();
            });
        })
    })
};

console.reset();
managerInterface();



