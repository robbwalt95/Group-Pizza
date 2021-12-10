const itemList = document.querySelector("#itemList");
const container = document.querySelector("#container");

const managerRoute = firebase.functions().httpsCallable('managerRoute');
const updateStatus = firebase.functions().httpsCallable('updateStatus');

managerRoute().then(() => {
    itemList.textContent = "Loading....";
    let ref = firebase.firestore().collection("items");
    ref.onSnapshot(snapshot => {
        let items = [];
        snapshot.forEach(doc => {
            items.push({ ...doc.data(), id: doc.id })
        })
        let html = ``;
        items.forEach(item => {
            let inStock = "Yes";
            let buttonText = "Out of Stock";
            if (!item.inStock) {
                inStock = "No";
                buttonText = "Back in Stock"
            }
            html += `<li class="listItem">Name: ${item.name} In Stock: ${inStock}  
                        <button value="${item.id}" onclick='updateStatus("${item.id}")' class="itemButton">${buttonText}</button></li>`;

        });

        itemList.innerHTML = html

    })

}).catch(err => container.textContent = err)