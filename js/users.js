const managerRoute = firebase.functions().httpsCallable('managerRoute');
const userList = document.querySelector("#userList");
const managerStatus = firebase.functions().httpsCallable('managerStatus');

managerRoute().then(() => {
    let ref = firebase.firestore().collection("users").orderBy("email");

    ref.onSnapshot(snapshot => {
        let users = [];
        snapshot.forEach(doc => {
            users.push({ ...doc.data(), id: doc.id })
        })

        let html = ``;
        users.forEach(user => {
            let managerText = "No";
            let managerButtonText = "Allow Manager Access";
            console.log(user.manager)
            if (user.manager === true) {
                managerText = "Yes";
                managerButtonText = "Remove Manager Access";
            }
            html += `<div>
            <h5>User: ${user.email}</h5> <span>Manager: ${managerText}</span>
            <span><button onclick='managerStatus("${user.id}")' class='managerButton'> ${managerButtonText}</button >
            </div > `;
            console.log(user.id)

        })
        userList.innerHTML = html;
    })

})