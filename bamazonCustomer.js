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
            head: ['Item #', 'Description', 'Price'],
            colWidths: [8, 50, 7],
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
        table.push(row);
        // set item qty for input validation
        itemQty = table.length;
    }
    // Clear screen and display table
    console.reset();
    console.log('\n' + table.toString() + '\n');
};


// DB connect
// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId);
// });


console.reset();

// Customer Interface function
let customerInterface = function () {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['Make a purchase', 'Exit Store'],
            name: 'choice'
        }
    ]).then(function (data) {
        switch (data.choice) {
            case 'Make a purchase':
                makePurchase();
                break;
            case 'Exit Store':
                console.reset();
                connection.end();
                console.log(chalk.cyan('Good-Bye. Thanks for visiting.'));
                break;
        }
    });
};

let makePurchase = function () {

    // Grab all the products from the DB
    connection.query('SELECT * FROM `products`', function (err, res) {
        if (err) throw err;

        renderTable(res);

        // prompt customer for item id and,
        // validate their response against the number of items available
        inquirer.prompt([
            {
                name: 'number',
                message: `Enter the Item # for the product you'd like to purchase: `,
                validate: function (value) {
                    if (value > 0 && value <= itemQty) {
                        return true;
                    } else {
                        return 'Please enter a valid product id';
                    }
                }
            }

        // once an item has been selected, prompt customer for quantity.
        // Validate their response to only allow integers from 1 - 999
        ]).then(function (item) {
            inquirer.prompt({
                name: 'quantity',
                message: 'How many would you like to buy?',
                validate: function (value) {
                    let pass = value.match(/^\d{1,3}$/);
                    if (pass) {
                        return true;
                    }
                    return 'Please enter a valid quantity';
                }
            }).then(function (customer) {

                // Query the DB for item selected
                connection.query('SELECT * FROM `products` WHERE id=?', [item.number], function (err, res) {
                    if (err) throw err;
                    // Evaluate if there is enough quantity in stock to cover the order
                    // If not, alert customer
                    if (res[0].stock_quantity < customer.quantity) {
                        console.log(chalk.red('I\'m sorry there is insufficient inventory to fulfill your order.\n'));
                        customerInterface();
                    } else {
                        // If there is enough stock, then Update the DB record with reduced quantity
                        let newQty = res[0].stock_quantity - customer.quantity;
                        connection.query("UPDATE products SET ? WHERE ?",
                            [
                                {stock_quantity: newQty},
                                {id: item.number}
                            ]
                            , function (err, res) {
                            });
                    // calculate customer total and format into $##.## and display
                    let total = res[0].price * customer.quantity;
                    let totalFormatted = parseFloat(total).toFixed(2);
                    console.log(chalk.green(`\nYour total comes to $${totalFormatted} \nThank You for your business!\n`));

                    customerInterface();
                    }

                });
            })

        });
    });
};

customerInterface();




