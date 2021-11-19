function view_checkout() {
    var bag = JSON.parse(localStorage.getItem("bag"));
    var html = '';
    var total_price = 0;

    for (var i = 0; i < bag.length; i++) {
        let request = new XMLHttpRequest();
        request.open('GET', `api/getProduct?id=${bag[i].product_id}`, false);
        request.send(null);

        if (request.status === 200) {
            let data = JSON.parse(request.responseText);
            total_price += parseInt(data[0].PRICE * bag[i].quantity);
            html += `
            <tr class="titletrdes">
                <th scope="row" style="display: flex;"><img alt="placeholder image" class="img lazyload"
                        height="80px" src="img/${data[0].IMAGE}" width="80px">
                    <div class="info">
                        <p>${data[0].TITLE}</p>
                        <p>${data[0].SIZE}</p>
                        <p>Qty : ${bag[i].quantity}</p>
                    </div>
                </th>
                <td>Rp ${data[0].PRICE}</td>
                <td>Rp ${data[0].PRICE * bag[i].quantity}</td>
            </tr>
            `;
        }
    }
    html += `
    <tr style="border-bottom: 1px solid white;">
        <th>Total Price</th>
        <td></td>
        <td id="total-price">Rp ${total_price}</td>
    </tr>
    `
    document.getElementById("view-checkout").innerHTML = html;
}

view_checkout();