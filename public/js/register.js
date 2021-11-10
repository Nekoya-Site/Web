function revealhidePassword() {
    const x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function revealhideConfirmationPassword() {
    const x = document.getElementById("password_confirmation");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}