const menuItems = [
    { 
        name: "Burger", 
        price: 500,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349"
    },
    { 
        name: "Pizza", 
        price: 800,
        image: "https://images.unsplash.com/photo-1548365328-9f547fb0953d"
    },
    { 
        name: "Pasta", 
        price: 600,
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e"
    },
    { 
        name: "Soda", 
        price: 150,
        image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a"
    }
];

let cart = [];

if (document.getElementById("menu")) {
    const menuDiv = document.getElementById("menu");

    menuItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "menu-item";
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>Ksh ${item.price}</p>
            <button onclick="addToCart('${item.name}', ${item.price})">
                Add to Cart
            </button>
        `;
        menuDiv.appendChild(div);
    });
}

function addToCart(name, price) {
    cart.push({ name, price });
    displayCart();
}

function displayCart() {
    const cartDiv = document.getElementById("cart");
    cartDiv.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartDiv.innerHTML = "<p>Your cart is empty</p>";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price;

        cartDiv.innerHTML += `
            <div class="cart-item">
                <span>${item.name} - Ksh ${item.price}</span>
                <button onclick="removeFromCart(${index})" class="remove-btn">✖</button>
            </div>
        `;
    });

    cartDiv.innerHTML += `
        <h3 class="total">Total: Ksh ${total}</h3>
        <button onclick="clearCart()" class="clear-btn">Clear Cart</button>
    `;

    cartDiv.style.transform = "scale(1.03)";
    setTimeout(() => {
        cartDiv.style.transform = "scale(1)";
    }, 150);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
}

function clearCart() {
    cart = [];
    displayCart();
}

function placeOrder() {
    const name = document.getElementById("customerName").value;
    const table = document.getElementById("tableNumber").value;

    if (!name || !table || cart.length === 0) {
        alert("Fill all fields and add items!");
        return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    orders.push({
        customer: name,
        table: table,
        items: cart,
        total: total,
        status: "Pending"
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order Placed!");
    cart = [];
    displayCart();
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") {
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        displayOrders();
    } else {
        alert("Wrong login details");
    }
}

function displayOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const ordersDiv = document.getElementById("orders");
    const totalSales = document.getElementById("totalSales");

    ordersDiv.innerHTML = "";
    let sales = 0;

    orders.forEach((order, index) => {
        sales += order.total;

        let statusClass = order.status === "Served" ? "served" : "pending";

        ordersDiv.innerHTML += `
            <div class="menu-item">
                <h3>${order.customer} - Table ${order.table}</h3>
                <p>Total: Ksh ${order.total}</p>
                <p>Status: <span class="${statusClass}">${order.status}</span></p>
                <button onclick="updateStatus(${index})">Mark as Served</button>
            </div>
        `;
    });

    totalSales.innerHTML = `💰 Total Sales: Ksh ${sales}`;
}

function updateStatus(index) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders[index].status = "Served";
    localStorage.setItem("orders", JSON.stringify(orders));
    displayOrders();
}
