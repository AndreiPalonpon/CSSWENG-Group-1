var login = [
    {
        password: "12345"
    },
    {
        password: "LPPWDFI"
    }
];

function getPassword() {
    var password = document.getElementById('password').value;

    for (var i = 0; i < login.length; i++) {
        if (password == login[i].password) {
            console.log("Login Successful");
            window.location.href = 'dashboard.html'; 
            return false; // Prevent form submission
        }
    }

    console.log("Login Failed");
    alert("Password is incorrect. Please try again.");
    return false; 
}
