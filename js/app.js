const loginButton = document.querySelector('#login-button');
const logoutButton = document.querySelector('#logout-button');
const pizzaList = document.querySelector('#pizzas');
const toppingsList = document.querySelector('#toppings');
const inventoryLink = document.querySelector('#inventory');
const ordersLink = document.querySelector('#orders');
const registerLink = document.querySelector('#register');
const addToCart = document.querySelector('#addToCart');
const checkout = document.querySelector('#checkout');
const cartItems = document.querySelector('#cartItems');
let shoppingCart = [];
let cartItemId = 0;
let total = 0;

const db = firebase.firestore().collection('items').get();
db
	.then((items) => {
		items.forEach((item) => {
			let data = item.data();
			if (data.type === 'pizza') {
				let pizzaItem = `<div class="pizzaItem inStockPizza" name="${data.name}" value=${data.price}>${data.name}  ${data.price.toFixed(2)}</div>`;
				if (!data.inStock) {
					pizzaItem = `<div class="pizzaItem outOfStockPizza" name="${data.name}" value=${data.price}>${data.name}  ${data.price.toFixed(2)}</div>`;
				}
				pizzaList.innerHTML += pizzaItem;
			}
			else {
				let toppingItem = `<input class="topping" name="${data.name}" type="checkbox" value=${data.price}>${data.name} ${data.price.toFixed(2)}</input>`;
				if (!data.inStock) {
					toppingItem = `<input class="topping"type="checkbox" name="${data.name}" value=${data.price} disabled>${data.name} ${data.price.toFixed(2)}</input>`;
				}
				toppingsList.innerHTML += toppingItem;
			}
		});
	})
	.then(() => {
		let pizzas = document.querySelectorAll('.inStockPizza');
		pizzas.forEach((pizza) => {
			pizza.addEventListener('click', (e) => {
				pizzaDisplay(e.target);
			});
		});
	});

const pizzaDisplay = (target) => {
	let pizzas = document.querySelectorAll('.inStockPizza');
	pizzas.forEach((pizza) => {
		if (pizza == target) {
			pizza.classList.toggle('selected');
		}
		else {
			pizza.classList.remove('selected');
		}
	});
};

loginButton.addEventListener('click', () => {
	let email = document.querySelector('#login-email').value;
	let password = document.querySelector('#login-password').value;
	firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
		.then((user) => {
			console.log('logged in', user);
		})
		.catch((error) => {
			console.log(error);
		});
	document.querySelector('#login-email').value = '';
	document.querySelector('#login-password').value = '';
});

logoutButton.addEventListener('click', () => {
	firebase.auth().signOut().then(() => console.log('signed out'));
});

addToCart.addEventListener('click', () => {
	if (document.querySelector('.selected') === null) {
		console.log('Please select a Pizza.');
		return;
	}
	let cartItem = {};
	let toppings = [];
	let pizza = document.querySelector('.selected');
	let selectedToppings = document.querySelectorAll('.topping');

	let price = +pizza.getAttribute('value');

	selectedToppings.forEach((topping) => {
		if (topping.checked) {
			toppings.push(topping.getAttribute('name'));
			price += +topping.value;
		}
	});
	cartItemId++;
	cartItem.Id = cartItemId;
	cartItem.pizza = pizza.getAttribute('name');
	cartItem.toppings = toppings;
	cartItem.price = price;
	shoppingCart.push(cartItem);
	renderCart();
});

const renderCart = async () => {
	total = 0;
	let html = ``;
	shoppingCart.forEach(cartItem => {
		let item = `<div id=${cartItem.Id}>Size: ${cartItem.pizza} Toppings: ${cartItem.toppings} Price: ${cartItem.price.toFixed(2)}  <span class="delete"> X </span></div>`;
		html += item;
		total += cartItem.price;
	});
	cartItems.innerHTML = html;
	if (total > 0) {
		document.querySelector("#total").innerHTML = `Total: ${total.toFixed(2)}`;
	} else {
		document.querySelector("#total").innerHTML = ``;
	}
	const deleteButtons = document.querySelectorAll('.delete');
	deleteButtons.forEach(button => {
		button.addEventListener("click", (e) => {
			deleteCartItem(e.target);
		})
	})

};

const deleteCartItem = target => {
	const Id = target.parentElement.getAttribute("id");
	shoppingCart = shoppingCart.filter(cartItem => cartItem.Id !== +Id);
	renderCart();

}

checkout.addEventListener('click', () => {
	const user = firebase.auth().currentUser;
	const createOrder = firebase.functions().httpsCallable('createOrder');
	const pizzaSize = document.querySelector(".selected");
	if (pizzaSize === null) {
		console.log("Please select pizza size.");
		console.log(pizzaSize);
		return false;
	}
	if (user) {
		const orderData = {
			items: shoppingCart,
			total
		}
		console.log(orderData);
		createOrder(orderData);
		document.querySelector('.selected').classList.remove('selected');
		let selectedToppings = document.querySelectorAll('.topping');
		selectedToppings.forEach(topping => {
			topping.checked === false;
		});
		console.log('Order Placed!');
		shoppingCart = [];
		cartItemId = 0;
		renderCart();
	}
	else {
		console.log('Please log in to order.');
	}
});

const checkManager = firebase.functions().httpsCallable('checkManager');
firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		logoutButton.style.display = 'block';
		loginButton.style.display = 'none';
		registerLink.style.display = 'none';
		checkManager().then((result) => {
			if (result.data === true) {
				inventoryLink.style.display = 'block';
				ordersLink.style.display = 'block';
			}
		});
	}
	else {
		logoutButton.style.display = 'none';
		loginButton.style.display = 'block';
		inventoryLink.style.display = 'none';
		ordersLink.style.display = 'none';
		registerLink.style.display = 'block';
	}
});
