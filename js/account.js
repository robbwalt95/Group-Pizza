const firstNameInput = document.querySelector("#firstName");
const lastNameInput = document.querySelector("#lastName");
const phoneNumberInput = document.querySelector("#phoneNumber");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const stateInput = document.querySelector("#state");
const zipInput = document.querySelector("#zip");
const accountButton = document.querySelector("#accountButton");
const loginButton = document.querySelector('#login-button');
const logoutButton = document.querySelector('#logout-button');
const inventoryLink = document.querySelector('#inventory');
const ordersLink = document.querySelector('#orders');
const usersLink = document.querySelector('#users');
const registerLink = document.querySelector('#register');
const currentUser = document.querySelector('#currentUser');;
const loginEmail = document.querySelector('#login-email');
const loginPassword = document.querySelector('#login-password');
const accountInfo = document.querySelector('#accountInfo');
const orderHistoryLink = document.querySelector('#orderHistory');
const message = document.querySelector('#message');

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
            currentUser.textContent = error;
        });
    document.querySelector('#login-email').value = '';
    document.querySelector('#login-password').value = '';
});

logoutButton.addEventListener('click', () => {
    firebase.auth().signOut().then(() => currentUser.textContent = 'Signed out.');
});


//Nav Code
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

const populateFields = async (userID) => {
    let user = firebase.firestore().collection("users").doc(userID);
    let doc = await user.get();
    let address = await doc.data().address;

    if (Object.keys(address).length !== 0) {
        firstNameInput.value = address.firstName;
        lastNameInput.value = address.lastName;
        phoneNumberInput.value = address.phoneNumber;
        addressInput.value = address.address;
        cityInput.value = address.city;
        stateInput.value = address.state;
        zipInput.value = address.zip;
    }

}


const updateAccount = firebase.functions().httpsCallable('updateAccount');
accountButton.addEventListener("click", () => {
    let phoneValue = phoneNumberInput.value.trim();
    let phoneValueNum = +phoneValue;
    let regex = /^\d{10}$/;
    let phoneCheck = regex.test(phoneValueNum);
    message.textContent = "";

    if (!phoneCheck) {
        message.classList.remove("success");
        message.classList.add("error");
        message.textContent = "Please enter a valid phone number."
        return false;
    }
    let data = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        phoneNumber: phoneNumberInput.value,
        address: addressInput.value,
        city: cityInput.value,
        state: stateInput.value,
        zip: zipInput.value
    }

    updateAccount(data);

    firstNameInput.value = '';
    lastNameInput.value = '';
    phoneNumberInput.value = '';
    addressInput.value = '';
    cityInput.value = '';
    stateInput.value = '';
    zipInput.value = '';

    message.classList.remove("error");
    message.classList.add("success");
    message.textContent = "Account updated successfully.";


})

const checkManager = firebase.functions().httpsCallable('checkManager');
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        logoutButton.style.display = 'block';
        loginButton.style.display = 'none';
        registerLink.style.display = 'none';
        currentUser.textContent = `Logged in as ${user.email}`;
        loginEmail.style.display = 'none';
        loginPassword.style.display = 'none';
        accountInfo.style.display = 'block';
        usersLink.style.display = 'none';
        inventoryLink.style.display = 'none';
        loginPassword.style.display = "none";
        orderHistoryLink.style.display = 'block';
        populateFields(user.uid);
        checkManager().then((result) => {
            if (result.data === true) {
                inventoryLink.style.display = 'block';
                ordersLink.style.display = 'block';
                usersLink.style.display = 'block';
            }
        });
    }
    else {
        logoutButton.style.display = 'none';
        loginButton.style.display = 'block';
        inventoryLink.style.display = 'none';
        ordersLink.style.display = 'none';
        registerLink.style.display = 'block';
        usersLink.style.display = 'none';
        currentUser.textContent = '';
        loginEmail.style.display = 'block';
        loginPassword.style.display = 'block';
        accountInfo.style.display = 'none';
        orderHistoryLink.style.display = 'none';
    }
});
