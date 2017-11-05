//dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');

//connect to SQL server
var connection = mysql.createconnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'bamazon_db'
});

//set counter for total number of products
var productNumber = 0;

//connect to database
connection.connect(function(err) {
	//if error throw
	if (err) throw err;
	//new promise that selects all data from table in db
	new Promise(function(resolve, reject) {
		connection.query('SELECT * FROM products', function(err, res) {
			if (err) reject(err);
			resolve(res);
			console.log('Welcome to Bamazon! Here are our products:')
		});
		//console log each item and increment the number of products
	}).then(function(result) {
		result.forEach(function(item) {
			productTypes++;
			console.log('Item ID: ' + item.item_id + ' || Product Name: ' + item.product_name + ' || Price: ' + item.price);
		});
		//Enter the store
	}).then(function() {
		return enterStore();
		//catch errors
	}).catch(function(err) {
		console.log(err);
	});
});

//Function to enter the store
function enterStore() {
	inquirer.prompt([{
		name: 'entrance',
		message: 'Welcome to Bamazon! Are you ready to shop?',
		type: 'list',
		choices: ['Yes', 'No']
	}]).then(function(answer) {
		//goes to shopping menu if yes
		if (answer.entrance === 'Yes') {
			menu();
		} else {
			//Exist CLI if No
			console.log('Visit us another time! Bye');
			connection.destroy();
			return;
		}
	});
}

//function for menu options for the customer
function menu() {
	return inquirer.prompt([{
		name: 'item',
		message: 'Enter the number that coincides with the item you would like to buy.',
		type: 'input',
		//validator for product number being a number and to verify if it exists
		validate: function(value) {
			if ((isNaN(value) === false) && (value <= productTypes)) {
				return true;
			} else {
				console.log('\nPlease enter a valid number.');
				return false;
			}
		}
	}, {
		name: 'quantity',
		message: 'How many would you like to purchase?',
		type: 'input',
		//validator to verify number
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			} else {
				console.log('\nPlease enter a valid number.');
				return false;
			}
		}
		//new promise to pull all data from SQL
	}]).then(function(answer) {
		return new Promise(function(resolve, reject) {
			connection.query('SELECT * FROM products WHERE ?', { item_id: answer.item }, function(err, res) {
				if (err) reject(err);
				resolve(res);
			});
			// if valid number/quantity, save to local object 
		}).then(function(result) {
			var savedData = {};

			if (parseInt(answer.quantity) <= parseInt(result[0].stock_quantity)) {
				savedData.answer = answer;
				savedData.result = result;
			} else if (parseInt(answer.quantity) > parseInt(result[0].stock_quantity)) {
				console.log('Insufficient quantity!');
			} else {
				console.log('An error occurred and no order was placed. Goodbye.');;
			}

			return savedData;
			//update sql db and console log 
		}).then(function(savedData) {
			if (savedData.answer) {
				var currentQuantity = parseInt(savedData.result[0].stock_quantity) - parseInt(savedData.answer.quantity);
				var itemId = savedData.answer.item;
				var cost = parseInt(savedData.result[0].price) * parseInt(savedData.answer.quantity);
				connection.query('UPDATE products SET ? WHERE ?', [{
					stock_quantity: currentQuantity
				}, {
					item_id: itemId
				}], function(err, res) {
					if (err) throw err;
					console.log('The price of your order is$' + cost + '. Thank you for shopping at Bamazon and have a great day!');
					connection.destroy();
				});
			} else {
				//re enter store
				enterStore();
			}
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