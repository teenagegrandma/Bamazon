--Create Db
CREATE DATABASE bamazon_db;

--use db
USE bamazon_db;

--Create product table and columns
CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price INT default 0,
    stock_quantity INT default 0,
    PRIMARY KEY (item_id)
);

--inserts initial data
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('googly eyes', 'craft supplies', 5, 1000),
    ('hiking boots', 'shoes', 90, 50),
    ('nude slingbacks', 'shoes', 55, 70),
    ('NASA patch', 'craft supplies', 7, 200),
    ('Persian rug', 'furniture', 250, 10),
    ('Eames chair', 'furniture', 500, 7),
    ('Balexa speaker', 'electronics', 100, 15),
    ('drum machine', 'electronics', 200, 50);

--quick view of table
SELECT * FROM products;