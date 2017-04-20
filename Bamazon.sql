-- CREATE DATABASE Bamazon;
--
-- USE Bamazon;

CREATE TABLE products(
  id INT(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price FLOAT DEFAULT 0 NOT NULL,
  stock_quantity INT(11) DEFAULT 0 NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Star Wars Death Star Waffle Maker", "Home / Kitchen", 39.99, 50);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("R2-D2 Tape Measure", "Geek Tools", 24.99, 50);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("iFixit Pro Tech Toolkit", "Geek Tools", 69.99,50);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Poke Ball Serving Bowl Set", "Home / Kitchen", 19.99, 50);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Star Trek Spock Oven Mitt", "Home / Kitchen", 14.99, 50);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Canned Unicorn Meat", "Home / Kitchen", 9.99, 50);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("The Bag of Holding", "Accessories", 49.99, 50);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Wicket Ewok Backpack Buddy", "Accessories", 34.99, 50);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Star Trek Uniform Messenger Bag", "Accessories", 48.99, 50);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Hobbit Gandalf Pipe", "Accessories", 64.99, 50);


