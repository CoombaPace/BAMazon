INSERT INTO departments(department, overhead)
VALUES ('electronics', 500.00),
		('clothing', 250.00),
		('food', 150.00);

INSERT INTO products(product, dept_id, price, qty)
VALUES ('Gaming PC Tower', 1, 27.59, 100),
		('Headphones', 1, 9.99, 15),
		('Amazon Fire Stick', 1, 39.99, 15),
		('ROKU TV', 1, 479.99, 7),
		('MySql Jeggings', 3, 20.99, 40),
		('Protype Prime Trucker Hat', 3, 19.99, 30),
		('ATL UTD Knock-Off Jersey', 3, 10.99, 35),
		('avocados', 2, 15.99, 15),
		('hotdogs', 2, 19.99, 20),
		('tortillas', 2, 5.99, 10);


SELECT * FROM products;
SELECT * FROM departments;