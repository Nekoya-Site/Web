function add(product_id, price) {
    var inputCount = document.getElementById(product_id);
    inputCount.value++;
    document.getElementById(product_id + '-price').innerHTML = 'Rp ' + price * inputCount.value;
    addToBag(product_id);
}

function minus(product_id, price) {
    var inputCount = document.getElementById(product_id);
    if (inputCount.value > 0) {
        inputCount.value--;
        document.getElementById(product_id + '-price').innerHTML = 'Rp ' + price * inputCount.value;
        removeFromBag(product_id);
    }
}

function remove(product_id) {
    var bag = JSON.parse(localStorage.getItem("bag"));
    bag = bag.filter( x => {
        if (x.product_id != product_id) {
            return x;
        }
        location.reload();
    });
    localStorage.setItem("bag", JSON.stringify(bag));
}

function addToBag(product_id) {
    if (localStorage.getItem("bag") === null) {
        localStorage.setItem("bag", "[]");
    }
    var bag = JSON.parse(localStorage.getItem("bag"));
    var filtered_bag = bag.filter( x => x.product_id == product_id);
    if (filtered_bag.length === 0) {
        bag.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        filtered_bag[0].quantity++;
        bag = bag.filter( x => {
            if (x.product_id != product_id) {
                return x;
            }
        });
        bag.push(filtered_bag[0]);
    }
    localStorage.setItem("bag", JSON.stringify(bag));
}

function removeFromBag(product_id) {
    if (localStorage.getItem("bag") === null) {
        localStorage.setItem("bag", "[]");
    } else {
        var bag = JSON.parse(localStorage.getItem("bag"));
        var filtered_bag = bag.filter( x => x.product_id == product_id);
        if (filtered_bag.length > 0) {
            filtered_bag[0].quantity--;
            if (filtered_bag[0].quantity === 0) {
                bag = bag.filter( x => {
                    if (x.product_id != product_id) {
                        return x;
                    }
                    location.reload();
                });
            } else {
                bag = bag.filter( x => {
                    if (x.product_id != product_id) {
                        return x;
                    }
                });
                bag.push(filtered_bag[0]);
            }
        }
        localStorage.setItem("bag", JSON.stringify(bag));
    }
}

function view_bag() {
    var bag = JSON.parse(localStorage.getItem("bag"));
    var html = '';

    for (var i = 0; i < bag.length; i++) {
        jQuery.get('api/getProduct', { id: bag[i].product_id }, (data) => {
            let current_bag = bag.filter( x => x.product_id == data[0].ID);
            html += `
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-7 col-md-6 col-lg-4">
                            <img alt="placeholder image" class="img-fluid lazyload" src="img/${data[0].IMAGE}"
                                width="180px" height="180px" />
                        </div>
                        <div class="col-sm-5 col-md-6 col-lg-8">
                            <h2>${data[0].TITLE}</h2>
                            <h4>Size : ${data[0].SIZE}</h4>
                            <h6>Qty</h6>
                            <div style="display: flex;">
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-default btn-number" style="color: white;"
                                        onclick="minus('${current_bag[0].product_id}', '${data[0].PRICE}')"><i class="far fa-minus-square"></i></button>
                                </span>
                                <input class="box" type="text" disabled="disabled" value="${current_bag[0].quantity}"
                                    class="form-control input-number" id="${current_bag[0].product_id}" />
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-default btn-number" style="color: white;"
                                        onclick="add('${current_bag[0].product_id}', '${data[0].PRICE}')"><i class="far fa-plus-square"></i></button>
                                </span>
                            </div>
                            <br>
                            <p id="${current_bag[0].product_id}-price" class="price">Rp ${data[0].PRICE * current_bag[0].quantity}</p>
                            <a href="javascript:;" onclick='return remove("${current_bag[0].product_id}")' style="color:red;"><i class="far fa-trash-alt" color="red"></i> <u>Remove</u></a>
                            <br><br>
                        </div>
                    </div>
                </div>
            </div>
            `;
            document.getElementById("view-bag").innerHTML = html;
        });
    }
    document.getElementById("total-price").innerHTML = 'Rp -';
}

view_bag();