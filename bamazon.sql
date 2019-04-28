create database bamazon;

create table products (
item_id int not null,
product_name varchar(50) not null,
deptartment_name varchar(50) not null,
price int not null,
qty int not null,
PRIMARY KEY (item_id)
);
