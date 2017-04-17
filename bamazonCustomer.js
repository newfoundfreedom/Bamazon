// Dependency Loading and Global Variables
const mysql = require('mysql'),
    Table = require('cli-table'),
    inquirer = require('inquirer');
// initialize the following variables
let itemQty,
    table;


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
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
});


// Grab all products from the DB
connection.query('SELECT * FROM `products`', function (err, res) {
    if (err) throw err;

    // Create Table - setup structure and headers
    let table = new Table({
        head: ['Item #', 'Description', 'Price']
        , colWidths: [8, 50, 7]
    });

    // Push each items ID, Name and Price to the table
    for (item in res) {
        let row = [];
        row.push(res[item].id);
        row.push(res[item].product_name);
        row.push(res[item].price);
        table.push(row);
        itemQty = table.length;
    }
    // Clear screen and show table
    console.reset();
    console.log('\n' + table.toString() + '\n\n');

    connection.end();

    inquirer.prompt([
        {
            name: 'number',
            message: 'Enter the item number for the product you want to purchase: ',
            validate: function (value) {
                if (value > 0 && value <= itemQty) {
                    return true;
                } else {
                    return 'Please enter a valid item number';
                }
            }
        }
    ]).then(function (item) {
        inquirer.prompt({
            name: 'quantity',
            message: 'How many would you like to buy?',
            validate: function (value) {
                var pass = value.match(/\d+/);
                if (pass) {
                    return true;
                }
                return 'Please enter a valid quantity';
            }
        }).then(function (qty) {
            console.log(item.number);
            console.log(qty.quantity);
        })

    });

});


// disconnect from DB


// inquirer.prompt(itemNum).then(function (answers) {
//     console.log(JSON.stringify(answers, null, '  '));
// });



