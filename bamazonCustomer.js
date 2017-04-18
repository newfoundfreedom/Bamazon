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


// DB connect
// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId);
// });


// Grab all the products from the DB
connection.query('SELECT * FROM `products`', function (err, res) {
    if (err) throw err;

    // Create Table - setup structure and headers
    let table = new Table({
        head: ['Item #', 'Description', 'Price']
        , colWidths: [8, 50, 7]
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

    // connection.end();

    // prompt customer for item id and,
    // validate their response against the number of items available
    inquirer.prompt([
        {
            name: 'number',
            message: `Enter the item id for the product you'd like to purchase: `,
            validate: function (value) {
                if (value > 0 && value <= itemQty) {
                    return true;
                } else {
                    return 'Please enter a valid product id';
                }
            }
        }
        // once an item has been selected, prompt customer for quantity
        // validate their response to only allow integers from 1 - 999
    ]).then(function (item) {
        inquirer.prompt({
            name: 'quantity',
            message: 'How many would you like to buy?',
            validate: function (value) {
                var pass = value.match(/^\d{1,3}$/);
                if (pass) {
                    return true;
                }
                return 'Please enter a valid quantity';
            }
        }).then(function (customer) {
            // console.log(item.number);
            // console.log(customer.quantity);

            // DB connect
            // connection.connect(function (err) {
            //     if (err) throw err;
            //     console.log("connected as id " + connection.threadId);
            // });
            connection.query('SELECT * FROM `products` WHERE id=?', [item.number], function (err, res) {
                if (err) throw err;
                // let resFormatted = (JSON.stringify(res, null, 2));
                // console.log(resFormatted);
                // console.log(resFormatted[0].stock_quantity);

                if (res[0].stock_quantity < customer.quantity) {
                    console.log(chalk.red('I\'m sorry there is insufficient inventory to fulfill your order.\n'));
                } else {
                    let newQty = res[0].stock_quantity - customer.quantity;
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {stock_quantity: newQty},
                            {id: item.number}
                        ]
                        , function (err, res) {
                        });
                }
                // disconnect from DB
                connection.end();
            });
        })

    });

});





