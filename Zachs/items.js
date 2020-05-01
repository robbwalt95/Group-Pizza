const itemList = document.querySelector("#itemList");
const container = document.querySelector("#container");

const managerRoute = firebase.functions().httpsCallable('managerRoute');
const updateStatus = firebase.functions().httpsCallable('updateStatus');
let itemsArr = [];

managerRoute().then(() => {
    let db = firebase.firestore();
    db.collection("items").get()
        .then(items => {
            items.forEach(item => {
                const data = item.data();
                let inStock = "Yes";
                let buttonText = "Out of Stock";
                if (!data.inStock) {
                    inStock = "No";
                    buttonText = "Back in Stock"
                }
                const li = `<li class="listItem">Name: ${data.name} In Stock: ${inStock}  
                        <button value="${item.id}" class="itemButton">${buttonText}</button></li>`;
                itemList.innerHTML += li

            });

        })

        .then(() => {
            let submitDOM = `<button class="submitButton"> Submit </button>`;
            container.innerHTML += submitDOM;

            let itemButtons = document.querySelectorAll(".itemButton");
            itemButtons.forEach(itemButton => {
                itemButton.addEventListener("click", (e) => {
                    itemButton.classList.toggle("selected");
                    let itemValue = e.target.value;
                    if (itemsArr.includes(itemValue)) {
                        itemsArr = itemsArr.filter(item => item !== itemValue)
                    } else {
                        itemsArr.push(itemValue)
                    }
                })
            })

            let submitButton = document.querySelector(".submitButton");
            submitButton.addEventListener("click", () => {
                itemsArr.forEach(item => {
                    updateStatus(item).then(result => console.log(result))
                })
                console.log(itemsArr);
                itemsArr = [];
                console.log(itemsArr);
            })
        })
}).catch(err => container.textContent = err)