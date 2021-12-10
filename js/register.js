const registerButton = document.querySelector("#register-button");
const errorText = document.querySelector(".error");

registerButton.addEventListener("click", () => {
  const email = document.querySelector("#register-email").value;
  const password = document.querySelector("#register-password").value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(user => {
      console.log('registered ', user);
      document.querySelector("#register-password").value = "";
      document.querySelector("#register-email").value = "";
    })
    .catch(error => {
      errorText.textContent = error;
    });
})