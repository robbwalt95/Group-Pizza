const registerButton = document.querySelector("#register-button");

registerButton.addEventListener("click", () => {
    const email = document.querySelector("#register-email").value;
    const password = document.querySelector("#register-password").value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(user => {
		
		
	  alert("Account Made. Please go to the Account tab and sign in");
      console.log('registered?? ', user);
      document.querySelector("#register-password").value= "";
      document.querySelector("#register-email").value = "";
    })
    .catch(error => {
      console.log(error)
    });
})