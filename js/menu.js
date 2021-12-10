
const pizzaList = document.querySelector('#pizzas');
const toppingsList = document.querySelector('#toppings');
const addToCart = document.querySelector('#addToCart');
const checkout = document.querySelector('#checkout');
const cartItems = document.querySelector('#cartItems');
const message = document.querySelector('.message');
let shoppingCart = [];
let cartItemId = 0;
let total = 0;

const db = firebase.firestore().collection('items').get();
db.then((items) => {
    items.forEach((item) => {
        let data = item.data();
        if (data.type === 'pizza') {
            let pizzaItem = `<div id="${item.id}"class="pizzaItem inStockPizza" onclick="pizzaDisplay('${item.id}')"name="${data.name}" value=${data.price}>${data.name}  ${data.price.toFixed(2)}</div>`;
            if (!data.inStock) {
                pizzaItem = `<div class="pizzaItem outOfStockPizza" name="${data.name}" value=${data.price}>${data.name}  ${data.price.toFixed(2)}</div>`;
            }
            pizzaList.innerHTML += pizzaItem;
        }
        else {
            let toppingItem = `<input class="topping" name="${data.name}" type="checkbox" value=${data.price}>${data.name} ${data.price.toFixed(2)}</input><br>`;
            if (!data.inStock) {
                toppingItem = `<input class="topping"type="checkbox" name="${data.name}" value=${data.price} disabled>${data.name} ${data.price.toFixed(2)}</input>`;
            }
            toppingsList.innerHTML += toppingItem;
        }
    });
})

const pizzaDisplay = (pizzaId) => {
    let pizzas = document.querySelectorAll('.inStockPizza');
    pizzas.forEach((pizza) => {
        if (pizza.id == pizzaId) {
            pizza.classList.toggle('selected');
        }
        else {
            pizza.classList.remove('selected');
        }
    });
};

addToCart.addEventListener('click', () => {
    message.textContent = " ";
    if (document.querySelector('.selected') === null) {
        message.textContent = "Please select a pizza size."
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

const renderCart = () => {
    total = 0;
    let html = ``;
    shoppingCart.forEach(cartItem => {
        let item = `<div id=${cartItem.Id}>Size: ${cartItem.pizza} Toppings: ${cartItem.toppings.join(', ')} 
		Price: ${cartItem.price.toFixed(2)}  <span onclick='deleteCartItem("${cartItem.Id}")' class="delete"> X </span>
		</div>`;
        html += item;
        total += cartItem.price;
    });
    cartItems.innerHTML = html;
    if (total > 0) {
        document.querySelector("#total").innerHTML = `Total: ${total.toFixed(2)}`;
    } else {
        document.querySelector("#total").innerHTML = ``;
    }

};

const deleteCartItem = targetId => {
    shoppingCart = shoppingCart.filter(cartItem => cartItem.Id !== +targetId);
    renderCart();
}

checkout.addEventListener('click', () => {
    message.textContent = '';
    const user = firebase.auth().currentUser;
    const createOrder = firebase.functions().httpsCallable('createOrder');
    const pizzaSize = document.querySelector(".selected");
    if (pizzaSize === null) {
        message.textContent = "Please select pizza size.";
        return false;
    }
    if (user) {
        const orderData = {
            items: shoppingCart,
            total
        }
        createOrder(orderData);
        document.querySelector('.selected').classList.remove('selected');
        let selectedToppings = document.querySelectorAll('.topping');
        selectedToppings.forEach(topping => {
            topping.checked === false;
        });
        message.textContent = 'Order Placed!';
        shoppingCart = [];
        cartItemId = 0;
        renderCart();
    }
    else {
        message.textContent = 'Please log in to order.'
    }
});

