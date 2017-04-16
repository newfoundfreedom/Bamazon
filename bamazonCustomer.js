// Dependency Loading and Global Variables
const mysql = require('mysql'),
    Table = require('cli-table');

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


connection.query('SELECT * FROM `products`', function (err, res) {
    if (err) throw err;

    let table = new Table({
        head: ['Item #', 'Description', 'Price']
        , colWidths: [8, 50, 7]
    });

    for (item in res) {
        let row = [];
        row.push(res[item].id);
        row.push(res[item].product_name);
        row.push(res[item].price);
        table.push(row);
    }

    console.log(table.toString());
});


// kill DB connect
connection.end();
