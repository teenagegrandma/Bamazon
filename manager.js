//dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');

//connect to SQL server
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'bamazon_db'
});

//number of products
var productNumber = 0;

//connect to db
connection.connect(function(err) {
	//throw errors if exists error
	if (err) throw err;
	//new promise that selects all data from table
	new Promise(function(resolve, reject) {
		connection.query('SELECT * FROM products', function(err, res) {
			if (err) reject(err);
			resolve(res);
			console.log('Hi manager!')
		});
	}).then(function(result) {
		//increment for products based on database
		result.forEach(function(item) {
			productNumber++;
		});

		return enterManagerBama();
		//catch errors
	}).catch(function(err) {
		console.log(err);
	});
});

//manager prompt
function enterManagerBama() {
	inquirer.prompt([{
		name: 'entrance',
		message: 'What do you want to do?',
		type: 'list',
		choices: ['View the Current Products', 'View the Products Low on Inventory', 'Add Inventory', 'Add New Product for Sale', 'Exit App']
	}]).then(function(answer) {
		switch (answer.entrance) {
			case 'View the Current Products':
				inventoryItems();
				break;
			case 'View the Products Low on Inventory':
				lowInventory();
				break;
			case 'Add Inventory':
				addInventory();
				break;
			case 'Exit':
				console.log('Goodbye Mr. Manager!');
				connection.destroy();
				return;
				break;
			default: 
				enterManagerBama();
				break
		};
	});
}

//log all items
function logInventory(result) {
	result.forEach(function(item) {
		productNumber++;
		console.log('Item ID: ' + item.itm_id + ' || Product Name: ' + item.product_name + ' || Department: ' + item.department_name + ' || Price: ' + item.price + ' || Stock: ' item.stock_quantity);
	});
}

//pulls items from database
function inventoryItems(result) {
	return new Promise(function(resolve, reject) {
		connection.query('SELECT * FROM products', function(err, res) {
			if (err) reject(err);
			resolve(res);
		});
	}).then(function(result) {
		logInventory(result);
	}).then(function(){
		enterManagerBama();
		//catch errors
	}).catch(function(err) {
		console.log(err);
		connection.destroy();
	});
}	

//grabs low inventory items from database (5b or below)
function lowInventory() {
	return new Promise(function(resolve, reject) {
		connection.query('SELECT * FROM products WHERE stock_quantity < 5', funciton(err, res) {
			if (err) reject(err);
			resolve(res);
		});
	}).then(function(result) {
		logInventory(result);
	}).then(function() {
		enterManagerBama();
		//catch errors
	}).catch(function(err) {
		console.log(err);
		connection.destroy();
	});
}

//function to add inventory sql db
function addInventory() {
	return inquirer.prompt([{
		name: 'item',
		message: 'Enter the number that coincides with the product that you would like to add stock quantity.',
		type: 'input',
		validate: function(value) {
			//validator
			if ((isNaN(value) === false) && (value <= productNumber)) {
				return true;
			} else {
				console.log('\nPlease enter a valid number.');
				return false;
			}
		}
	}, {
		name: 'quantity',
		message: 'How many of this product would you like to add?',
		type: 'input',
		//validator
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			} else {
				console.log('\nPlease enter a valid number.');
				return false;
			}
		}
	}]).then(function(answer) {
		return new Promise(function(resolve, reject) {
			conneciton.query('SELECT stock_quantity FROM products WHERE ?', { item_id: answer.item }, function(err, res){
				if (err) reject(err);
				resolve(res);
			});
		}).then(function(result) {
			var updatedInventory = parseInt(result[0].stock_quantity) + parseInt(answer.quantity);
			var itemId = answer.item
			connection.query('UPDATE products SET ? WHERE ?', [{
				stock_quantity: updatedInventory
			}, {
				item_id: itemId
			}], function(err, res) {
				if (err) throw err;
				console.log('The total stock has been updated to ' + updatedInventory + '.');
				enterManagerBama();
			});
			//catch errors
		}).catch(function(err) {
			console.log(err);
			connection.destroy();
		});
		//catch errors
	}).catch(function(err) {
		console.log(err);
		connection.destroy();
	});
}

//add new product to db
function addInventory() {
	return inquirer.prompt([{
		name: 'product',
		message: 'Enter the name of the product that you would like to add to the Bamazon store.',
		type: 'input',
		//validator
		validate: function(value) {
			if (value === '') {
				console.log('\nPlease enter a valid name.');
				return false;
			} else {
				return true;
			}
		}
	}, {
		name: 'department',
		message: 'Name of department that product is located.',
		type: 'input',
		//validate
		validate: function(value) {
			if (value === '') {
				console.log('\nPlease enter a valid name.');
				return false;
			} else {
				return true;
			}
		}
	}, {
		name: 'price',
		message: 'Enter the price for this new product.',
		type: 'input',
		//validate
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			} else {
				console.log('\nPlease enter a valid price.');
				return false;
			}
		}
	}, {
		name: 'quantity',
		message: 'Enter the amount of stock.',
		type: 'input',
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			} else {
				console.log('\nPlease enter a valid number.');
				return false;
			}
		}
	}]).then(function(answer) {
		//new promise to update db
		return new Promise(function(resolve, reject) {
			connection.query('INSERT INTO products SET ?', [{
				product_name: answer.product,
				department_name: answer.department,
				price: answer.price,
				stock_quantity: answer.stock_quantity
			}], function(err, res) {
				if (err) reject(err);
				resolve(res);
			});
			//console log message
		}).then(function() {
			console.log('The product has been added to Bamazon.');
			enterManagerBama();
			//catch errors
		}).catch(function(err) {
			console.log(err);
			connection.destroy();
		});
		//catch errors
	}).catch(function(err) {
		console.log(err);
		connection.destroy();
	});
}

