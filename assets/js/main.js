"use strict";

/*
    Issue: Access to fetch at 'https://api.ebay.com/identity/v1/oauth2/token' from origin 'http://127.0.0.1:5500' 
           has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 
           'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves 
           your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

    Solution: https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome
    
     To start this web app:
    1. Right click on this page -> "Open with Live Server"
    2. Open a new chrome browser with this command in the terminal:
       $ open -n -a "Google Chrome" --args --user-data-dir=/tmp/temp_chrome_user_data_dir http://127.0.0.1:5500/index.html --disable-web-security
    3. Execute the following command in a terminal to get a new access token
       $ node /Users/jfung/coding/ebay-oauth-client/client.js
    4. Copy and paste the access token into assets/js/main.js

*/

// const req = require('request');

function printItemSummaries(obj) {

    for (const i in obj) {
        var divTitle = document.createElement("a");
        divTitle.setAttribute('href', obj[i]['itemWebUrl']);
        var title = document.createTextNode("Title: " + obj[i]['title']);
        divTitle.appendChild(title);

        // var divThumbnail = document.createElement("img");
        // divThumbnail.src = obj[i]['image']['imageUrl'];
        // divTitle.appendChild(divThumbnail);

        var divImg = document.createElement("div");
        var img = document.createElement("img");
        img.src = obj[i]['image']['imageUrl'];
        divImg.appendChild(img);

        var divPrice = document.createElement("div");
        divPrice.setAttribute('class', 'price');
        var content = document.createTextNode("Price: " + obj[i]['price']['value']);
        divPrice.appendChild(content);

        var divCondition = document.createElement("div");
        divCondition.setAttribute('class', 'condition');
        var condition = document.createTextNode("Condition: " + obj[i]['condition']);
        divCondition.appendChild(condition);

        var divSeparator1 = document.createElement("br");
        var divSeparator2 = document.createElement("br");


        var parentDiv = document.getElementById("results");
        var refDiv = document.getElementById("items");
        parentDiv.insertBefore(divSeparator1, refDiv.nextSibling);
        parentDiv.insertBefore(divSeparator2, refDiv.nextSibling);
        parentDiv.insertBefore(divImg, refDiv.nextSibling);
        parentDiv.insertBefore(divCondition, refDiv.nextSibling);
        parentDiv.insertBefore(divPrice, refDiv.nextSibling);
        parentDiv.insertBefore(divTitle, refDiv.nextSibling);
    }
}

function setDefaultValues() {
    document.getElementById('lowest_price').value = 10
    document.getElementById('highest_price').value = 999
    document.getElementById('keywords').value = ('Steph Curry RC topps')
    document.getElementById('max_display').value = 5
}

window.onload = function() {
    this.setDefaultValues()
}


const fetchData = async () => {
    var keywords = document.getElementById("keywords").value.replace(' ', '+')
    var lowest_price = document.getElementById('lowest_price').value
    var highest_price = document.getElementById('highest_price').value
    var max_display = document.getElementById('max_display').value

    const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${keywords}&filter=price:\[${lowest_price}..${highest_price}\]&filter=priceCurrency:USD&limit=${max_display}`
    const token = ""
    
    const api_call = await fetch(url, {
        headers: {
            "Authorization": 'Bearer ' + token,
        }
    })
    const data = await api_call.json()
    return {data}
}


const resp_data = () => {
    fetchData().then((resp) => {
        console.log(resp)
        printItemSummaries(resp['data']['itemSummaries'])
    })

    return false;
}

