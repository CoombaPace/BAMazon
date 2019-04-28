INSERT INTO departments(department, overhead)
VALUES ('clothing',27.59),
		('pets',20),
		('book',35),
		('furniture',56.24),
		('electronics',569.35);

INSERT INTO products(product, dept_id, price, qty)
VALUES ('shorts',1,27.59,100),
		('doggo',2,500.00,6),
		('harry potter',3,100.00,5),
		('couch',4,1500.00,4),
		('TV',4,500.00,3),
		('monitor',5,750.50,2),
		('keyboards',5,20.00,5),
		('macbook',5,2500.00,20),
		('shoes',1,100.00,50),
		('t-shirt',1,10.00,150);


SELECT * FROM products;
SELECT * FROM departments;