function revealhidePassword1() {
    const x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function revealhidePassword2() {
    const x = document.getElementById("verifypassword");
    if (x.type === "verifypassword") {
        x.type = "text";
    } else {
        x.type = "verifypassword";
    }
}