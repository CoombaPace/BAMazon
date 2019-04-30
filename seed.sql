
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products(
item_id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
product VARCHAR(200) NOT NULL,
dept_id INT,
price DECIMAL(8,2),
qty INT NOT NULL,
product_sales FLOAT NOT NULL DEFAULT 0
);


INSERT IGNORE INTO products(product, dept_id, price, qty, product_sales)
VALUES('Gaming PC Tower', 1, 1200.00, 10, 200.0),
('Headphones', 1, 9.99, 15, 130.0),
('Amazon Fire Stick', 1, 39.99, 15, 120.0),
('ROKU TV', 1, 479.99, 7, 1600.0),
('MySql Jeggings', 3, 20.99, 40, 60.0),
('Prototype Prime Trucker Hat', 3, 19.99, 30, 80.0),
('ATL UTD Knock-Off Jersey', 3, 10.99, 35, 77.0),
('avocados', 2, 15.99, 15, 45.0),
('hotdogs', 2, 19.99, 18, 40.0),
('tortillas', 2, 5.99, 10, 11.0);

SELECT * FROM products;

CREATE TABLE IF NOT EXISTS departments(
dept_id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
department VARCHAR(100) NOT NULL,
overhead INT NOT NULL
);


INSERT IGNORE INTO departments(department, overhead) 
VALUES('electronics', 800.0),
('food', 950.0),
('clothing', 300.0);

SELECT * FROM departments;

