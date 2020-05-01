const managerRoute = firebase.functions().httpsCallable('managerRoute');

managerRoute().then(() => {
    let ref = firebase.firestore().collection("orders");

    ref.onSnapshot(snapshot => {
        let orders = [];
        snapshot.forEach(doc => {
            orders.push(doc.data())
            console.log(doc.data())
        })

        let html = ``;
        let itemHTML = ``;
        orders.forEach(order => {
            order.items.forEach(item => {
                itemHTML += `${item.pizza} with ${item.toppings} Price: ${item.price.toFixed(2)}<br>`
            })
            html += `<div><h5>Customer Id: ${order.customer}</h5>${itemHTML} <br>Total: ${order.total.toFixed(2)}<br> 
            Completed: ${order.completed}</span></div></br>`
            itemHTML = ``;
        })

        document.querySelector("#orderList").innerHTML = html;
    })
})



