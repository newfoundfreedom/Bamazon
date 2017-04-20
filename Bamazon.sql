CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products(
  id INT(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price FLOAT DEFAULT 0 NOT NULL,
  stock_quantity INT(11) DEFAULT 0 NOT NULL,
  total_sales FLOAT DEFAULT 0 NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Star Wars Death Star Waffle Maker", "Home / Kitchen", 39.99, 50);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("R2-D2 Tape Measure", "Geek Tools", 24.99, 150);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("iFixit Pro Tech Toolkit", "Geek Tools", 69.99,75);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Poke Ball Serving Bowl Set", "Home / Kitchen", 19.99, 130);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Star Trek Spock Oven Mitt", "Home / Kitchen", 14.99, 80);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Canned Unicorn Meat", "Home / Kitchen", 9.99, 6);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("The Bag of Holding", "Accessories", 49.99, 20);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Wicket Ewok Backpack Buddy", "Accessories", 34.99, 35);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Star Trek Uniform Messenger Bag", "Accessories", 48.99, 115);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Hobbit Gandalf Pipe", "Accessories", 64.99, 9);



-- CREATION OF DEPARTMENTS TABLE (CHALLENGE 3)

CREATE TABLE departments(
  department_id INT(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  over_head_costs FLOAT DEFAULT 0 NOT NULL,
  product_sales FLOAT DEFAULT 0 NOT NULL,
  total_profit FLOAT DEFAULT 0 NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO `departments` (`department_name`, `over_head_costs`)
VALUES ("Home / Kitchen", 1000.00);

INSERT INTO `departments` (`department_name`, `over_head_costs`)
VALUES ("Geek Tools", 1000.00);

INSERT INTO `departments` (`department_name`, `over_head_costs`)
VALUES ("Accessories", 1000.00);



