function revealhidePassword() {
    const x = document.getElementById("exampleDropdownFormPassword1");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}