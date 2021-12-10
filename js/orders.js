const managerRoute = firebase.functions().httpsCallable('managerRoute');
const completeOrder = firebase.functions().httpsCallable('completeOrder');
let orderList = document.querySelector("#orderList");
orderList.innerHTML = `<h5>Loading....</h5>`

managerRoute().then(() => {
    let ref = firebase.firestore().collection("orders").orderBy("date", "desc");

    ref.onSnapshot(snapshot => {
        let orders = [];
        snapshot.forEach(doc => {
            orders.push({ ...doc.data(), id: doc.id })
        })

        let html = ``;
        let itemHTML = ``;
        orders.forEach(order => {
            order.items.forEach(item => {
                itemHTML += `${item.pizza} with ${item.toppings.join(", ")} Price: ${item.price.toFixed(2)}<br>`;
            });
            let completedText = "Incomplete";
            let completeButtonText = "Complete Order";
            if (order.completed) {
                completedText = "Completed";
                completeButtonText = "Order Incomplete";
            }
            html += `<div>
            <h5>Customer Id: ${order.customer}</h5>Created: ${order.date.toDate().toDateString()} at ${order.date.toDate().toLocaleTimeString()} 
            <br>Order: ${itemHTML} <br>Total: ${order.total.toFixed(2)}<br> 
            <span>Status: ${completedText}</span><br><button onclick='completeOrder("${order.id}")' class='orderComplete'> ${completeButtonText}</button >
            </div ></br > `;
            itemHTML = ``;
            console.log(order.id)

        })
        orderList.innerHTML = html;
    })
})






