/* =========================================================
   CasaVibe - Main JavaScript
   ========================================================= */


/* =========================================================
   CART
   ========================================================= */

let cart = JSON.parse(localStorage.getItem("casaCart")) || [];


/* ---------- Save Cart ---------- */

function saveCart() {

    localStorage.setItem(
        "casaCart",
        JSON.stringify(cart)
    );
}


/* ---------- Cart Count ---------- */

function updateCartCount() {

    const countElements =
        document.querySelectorAll("#cart-count");

    const total = cart.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    countElements.forEach(element => {
        element.textContent = total;
    });
}


/* ---------- Add Product ---------- */

function addToCart(name, price, image) {

    const existing =
        cart.find(item => item.name === name);

    if (existing) {

        existing.quantity =
            Number(existing.quantity) + 1;

    } else {

        cart.push({
            name: name,
            price: Number(price),
            image: image,
            quantity: 1
        });
    }

    saveCart();

    updateCartCount();

    renderCart();

    showToast("Added to your cart ✓");
}


/* ---------- Change Quantity ---------- */

function changeQuantity(name, amount) {

    const item =
        cart.find(item => item.name === name);

    if (!item) return;

    item.quantity =
        Number(item.quantity) + Number(amount);


    /* إذا صارت الكمية صفر احذف المنتج */

    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product => product.name !== name
            );

        showToast("Product removed ✓");

    } else {

        showToast(
            amount > 0
                ? "Quantity increased ✓"
                : "Quantity decreased ✓"
        );
    }


    saveCart();

    updateCartCount();

    renderCart();
}


/* ---------- Remove Product ---------- */

function removeFromCart(name) {

    cart =
        cart.filter(
            item => item.name !== name
        );

    saveCart();

    updateCartCount();

    renderCart();

    showToast("Product removed from cart ✓");
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    let toast =
        document.querySelector(".toast");

    if (!toast) {

        toast =
            document.createElement("div");

        toast.className = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);
}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    const container =
        document.querySelector("#cart-items");

    if (!container) return;

    container.innerHTML = "";


    /* ---------- Empty Cart ---------- */

    if (cart.length === 0) {

        container.innerHTML = `

            <div
                style="
                    padding:70px 20px;
                    text-align:center;
                "
            >

                <h2
                    style="
                        font-family:'Playfair Display',serif;
                        font-size:35px;
                        margin-bottom:15px;
                    "
                >
                    Your cart is empty.
                </h2>

                <p
                    style="
                        color:#888;
                        margin-bottom:25px;
                    "
                >
                    Discover something beautiful
                    for your home.
                </p>

                <a
                    href="products.html"
                    class="primary-btn"
                >
                    Continue Shopping →
                </a>

            </div>

        `;

        updateCartTotal();

        return;
    }


    /* ---------- Products ---------- */

    cart.forEach(item => {

        const element =
            document.createElement("div");

        element.className =
            "cart-item";


        /* حماية اسم المنتج من علامات الاقتباس */

        const safeName =
            item.name
                .replace(/\\/g, "\\\\")
                .replace(/'/g, "\\'");


        element.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >


            <div>

                <h3>
                    ${item.name}
                </h3>


                <p>
                    ₪${Number(item.price).toLocaleString()}
                </p>


                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:12px;
                        margin-top:15px;
                    "
                >

                    <button
                        type="button"
                        onclick="changeQuantity('${safeName}', -1)"
                        style="
                            width:35px;
                            height:35px;
                            border:1px solid #ddd;
                            background:white;
                            cursor:pointer;
                            font-size:20px;
                        "
                    >
                        −
                    </button>


                    <span
                        style="
                            min-width:25px;
                            text-align:center;
                            font-weight:600;
                        "
                    >
                        ${item.quantity}
                    </span>


                    <button
                        type="button"
                        onclick="changeQuantity('${safeName}', 1)"
                        style="
                            width:35px;
                            height:35px;
                            border:1px solid #ddd;
                            background:white;
                            cursor:pointer;
                            font-size:20px;
                        "
                    >
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="remove-btn"
                    onclick="removeFromCart('${safeName}')"
                    style="
                        margin-top:15px;
                        cursor:pointer;
                    "
                >
                    Remove
                </button>

            </div>


            <div class="cart-price">

                ₪${(
                    Number(item.price) *
                    Number(item.quantity)
                ).toLocaleString()}

            </div>

        `;


        container.appendChild(element);

    });


    updateCartTotal();
}


/* =========================================================
   CART TOTAL
   ========================================================= */

function updateCartTotal() {

    const subtotalElement =
        document.querySelector("#cart-subtotal");

    const totalElement =
        document.querySelector("#cart-total");


    if (
        !subtotalElement ||
        !totalElement
    ) return;


    const subtotal =
        cart.reduce(
            (sum, item) =>
                sum +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );


    subtotalElement.textContent =
        `₪${subtotal.toLocaleString()}`;

    totalElement.textContent =
        `₪${subtotal.toLocaleString()}`;
}


/* =========================================================
   SHOP - ADD BUTTONS
   ========================================================= */

document
    .querySelectorAll(".add-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();


                const product =
                    this.closest(".shop-product");

                if (!product) return;


                const name =
                    product
                        .querySelector("h2")
                        .textContent
                        .trim();


                const priceText =
                    product
                        .querySelector("strong")
                        .textContent;


                const price =
                    Number(
                        priceText
                            .replace(/[^\d]/g, "")
                    );


                const image =
                    product
                        .querySelector("img")
                        .src;


                addToCart(
                    name,
                    price,
                    image
                );

            }
        );

    });


/* =========================================================
   WISHLIST
   ========================================================= */

let wishlist =
    JSON.parse(
        localStorage.getItem("casaWishlist")
    ) || [];


function toggleWishlist(button) {

    const product =
        button.closest(".shop-product");

    if (!product) return;


    const name =
        product
            .querySelector("h2")
            .textContent
            .trim();


    const image =
        product
            .querySelector("img")
            .src;


    const price =
        Number(
            product
                .querySelector("strong")
                .textContent
                .replace(/[^\d]/g, "")
        );


    const exists =
        wishlist.find(
            item => item.name === name
        );


    if (exists) {

        wishlist =
            wishlist.filter(
                item => item.name !== name
            );

        button.textContent = "♡";

        showToast(
            "Removed from wishlist"
        );

    } else {

        wishlist.push({

            name: name,

            image: image,

            price: price

        });

        button.textContent = "♥";

        showToast(
            "Added to wishlist ♥"
        );
    }


    localStorage.setItem(
        "casaWishlist",
        JSON.stringify(wishlist)
    );
}


document
    .querySelectorAll(".heart-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                toggleWishlist(this);

            }
        );

    });


/* =========================================================
   FILTERS
   ========================================================= */

document
    .querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {


                document
                    .querySelectorAll(".filter-btn")
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                this.classList.add("active");


                const category =
                    this
                        .textContent
                        .trim();


                document
                    .querySelectorAll(".shop-product")
                    .forEach(product => {


                        const categoryElement =
                            product.querySelector(
                                ".shop-product-info span"
                            );


                        if (!categoryElement) return;


                        const productCategory =
                            categoryElement
                                .textContent
                                .trim();


                        if (
                            category === "All" ||
                            productCategory === category
                        ) {

                            product.style.display = "";

                        } else {

                            product.style.display =
                                "none";

                        }

                    });

            }
        );

    });


/* =========================================================
   SEARCH
   ========================================================= */

function openSearch() {

    let overlay =
        document.querySelector(
            ".search-overlay"
        );


    if (overlay) {

        overlay.classList.add("active");

        setTimeout(() => {

            const input =
                document.querySelector(
                    "#search-input"
                );

            if (input) {
                input.focus();
            }

        }, 100);

        return;
    }


    overlay =
        document.createElement("div");

    overlay.className =
        "search-overlay";


    overlay.innerHTML = `

        <div class="search-box">

            <button
                class="close-search"
                onclick="closeSearch()"
            >
                ×
            </button>


            <p class="small-title">
                SEARCH CASAVIBE
            </p>


            <input
                id="search-input"
                type="text"
                placeholder="Search furniture..."
                oninput="searchProducts(this.value)"
            >


            <div id="search-results">

                <p class="search-hint">
                    Try "sofa", "chair", "table"...
                </p>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    setTimeout(() => {

        overlay.classList.add(
            "active"
        );


        const input =
            document.querySelector(
                "#search-input"
            );


        if (input) {
            input.focus();
        }

    }, 50);
}


function closeSearch() {

    const overlay =
        document.querySelector(
            ".search-overlay"
        );

    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }
}


function searchProducts(value) {

    const results =
        document.querySelector(
            "#search-results"
        );

    if (!results) return;


    value =
        value
            .toLowerCase()
            .trim();


    if (!value) {

        document
            .querySelectorAll(".shop-product")
            .forEach(product => {

                product.style.display = "";

            });


        results.innerHTML = `

            <p class="search-hint">
                Try "sofa", "chair", "table"...
            </p>

        `;

        return;
    }


    const products =
        document.querySelectorAll(
            ".shop-product"
        );


    let found = 0;


    products.forEach(product => {

        const name =
            product
                .querySelector("h2")
                .textContent
                .toLowerCase();


        const category =
            product
                .querySelector(
                    ".shop-product-info span"
                )
                .textContent
                .toLowerCase();


        if (
            name.includes(value) ||
            category.includes(value)
        ) {

            product.style.display = "";

            found++;

        } else {

            product.style.display =
                "none";

        }

    });


    results.innerHTML = `

        <p class="search-hint">

            ${found}
            result${found !== 1 ? "s" : ""}
            found

        </p>

    `;
}


/* =========================================================
   USER STATUS
   ========================================================= */

function updateUserStatus() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "casaUser"
            )
        );


    const userLinks =
        document.querySelectorAll(
            ".user-name"
        );


    if (!user) {

        userLinks.forEach(element => {

            element.textContent =
                "Login";

            element.href =
                "login.html";

        });

        return;
    }


    userLinks.forEach(element => {

        element.textContent =
            `Hi, ${user.name}`;

        element.href = "#";

    });
}


/* =========================================================
   START
   ========================================================= */

updateCartCount();

renderCart();

updateUserStatus();