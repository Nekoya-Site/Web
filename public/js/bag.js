function add(id) {
    var inputCount = document.getElementById(id);
    console.log("I got clicked");
    if (inputCount.value < 9) {
        inputCount.value++;
    } else {
        alert("MAX product reach");
    }
}

function minus(id) {
    var inputCount = document.getElementById(id);
    console.log("Minus got clicked");
    if (inputCount.value > 1) {
        inputCount.value--;
    } else {
        alert("Remove this item");
    }
}