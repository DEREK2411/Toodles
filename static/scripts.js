
document.addEventListener("DOMContentLoaded", function () {
    let paymentSectionVisible = false; // Flag to track if payment section is visible

    // Function to add a product to the cart
    function addToCart(productId, quantity) {
        console.log(
            `Attempting to add product ${productId} to cart with quantity ${quantity}...`
        ); // Debugging statement
        fetch("/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id: productId, quantity: quantity }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Add to Cart Response Data:", data); // Debugging statement
                if (data.message) {
                    updateCart();
                } else {
                    alert(data.error || "An error occurred");
                }
            })
            .catch((error) => {
                console.error("Error adding to cart:", error);
            });
    }

    // Function to update cart count and total
    function updateCart() {
        fetch("/cart")
            .then((response) => response.json())
            .then((cart) => {
                const cartCount = document.querySelector(".cart-count");
                const cartItems = document.getElementById("cart-items");
                const cartTotal = document.getElementById("cart-total");
                const emptyCartMessage =
                    document.getElementById("empty-cart-message");

                cartItems.innerHTML = ""; // Clear existing items
                let totalAmount = 0;

                if (cart.length === 0) {
                    emptyCartMessage.style.display = "block";
                    cartCount.textContent = "0";
                } else {
                    emptyCartMessage.style.display = "none";
                    cartCount.textContent = cart.reduce(
                        (acc, item) => acc + parseInt(item.quantity || 0),
                        0
                    );
                    cart.forEach((item) => {
                        const cartItem = document.createElement("div");
                        cartItem.classList.add("cart-item");
                        cartItem.innerHTML = `
        <p>${item.name} - ₹${item.price} (Quantity: ${item.quantity || 1
                            })</p>
      `;
                        cartItems.appendChild(cartItem);
                        totalAmount += parseFloat(item.price) * (item.quantity || 1); // Calculate total amount
                    });
                }

                cartTotal.textContent = totalAmount.toFixed(2); // Display total amount

                // Add animation class for cart count
                cartCount.classList.add("animate");
                setTimeout(() => cartCount.classList.remove("animate"), 1000);

                // Update the payment section with the latest total
                handleCheckout();
            })
            .catch((error) => console.error("Error updating cart:", error));
    }

    // Function to fetch and display products
    function loadProducts() {
        fetch("/products")
            .then((response) => response.json())
            .then((products) => {
                const productGrid = document.getElementById("product-grid");
                productGrid.innerHTML = ""; // Clear existing products

                products.forEach((product) => {
                    const productCard = document.createElement("div");
                    productCard.classList.add("product-card");
                    productCard.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button class="add-to-cart" data-product-id="${product.id}">Buy Now</button>
    `;
                    productGrid.appendChild(productCard);
                });

                // Re-bind "Buy Now" buttons
                document.querySelectorAll(".add-to-cart").forEach((button) => {
                    button.addEventListener("click", function () {
                        const productId = this.dataset.productId;
                        addToCart(productId, 1); // Default quantity to 1
                    });
                });
            })
            .catch((error) => console.error("Error loading products:", error));
    }

    // Function to handle checkout
    function handleCheckout() {
        const paymentSection = document.getElementById("payment-section");
        const paymentTotal = document.getElementById("payment-total");
        const cartTotal = document.getElementById("cart-total").textContent;

        paymentTotal.textContent = cartTotal; // Set the total amount in payment section

        // Toggle visibility of payment section based on paymentSectionVisible flag
        if (paymentSectionVisible) {
            paymentSection.style.display = "block";
        } else {
            paymentSection.style.display = "none";
        }
    }

    // Initial cart count update and product loading
    updateCart();
    loadProducts();

    // Carousel functionality
    const prevButton = document.querySelector(".carousel-control.prev");
    const nextButton = document.querySelector(".carousel-control.next");
    const slide = document.querySelector(".carousel-slide");
    const indicatorsContainer = document.querySelector(".carousel-indicators");
    let index = 0;
    let autoSlide;

    // Function to handle carousel sliding
    function showSlide() {
        const items = document.querySelectorAll(".carousel-item");
        const images = document.querySelectorAll(".carousel-item img");

        // Load images lazily
        if (index < items.length) {
            const img = images[index];
            if (!img.dataset.loaded) {
                img.src = img.dataset.src; // Load image
                img.dataset.loaded = "true"; // Mark as loaded
            }
        }

        // Update transform for sliding effect
        slide.style.transform = `translateX(-${index * 100}%)`;

        // Update indicators
        document.querySelectorAll(".carousel-indicator").forEach((indicator, i) => {
            indicator.classList.toggle("active", i === index);
        });
    }

    // Create indicators
    function createIndicators() {
        const items = document.querySelectorAll(".carousel-item");
        items.forEach((_, i) => {
            const indicator = document.createElement("div");
            indicator.classList.add("carousel-indicator");
            indicator.dataset.index = i;
            indicator.addEventListener("click", () => {
                index = i;
                showSlide();
            });
            indicatorsContainer.appendChild(indicator);
        });
    }

    // Event listeners for carousel controls
    nextButton.addEventListener("click", () => {
        index = (index + 1) % document.querySelectorAll(".carousel-item").length;
        showSlide();
    });

    prevButton.addEventListener("click", () => {
        index = (index - 1 + document.querySelectorAll(".carousel-item").length) % document.querySelectorAll(".carousel-item").length;
        showSlide();
    });

    // Initial carousel setup
    createIndicators();
    showSlide(); // Display the first slide

    // Auto-slide functionality
    function startAutoSlide() {
        autoSlide = setInterval(() => {
            index = (index + 1) % document.querySelectorAll(".carousel-item").length;
            showSlide();
        }, 5000); // Change slide every 5 seconds
    }

    startAutoSlide();

    // Pause on hover
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carousel.addEventListener('mouseleave', startAutoSlide);


    // Cart button functionality
    const cartButton = document.querySelector(".cart-button");
    const cartSection = document.getElementById("cart-section");
    const cartClose = document.querySelector(".cart-close");

    cartButton.addEventListener("click", () => {
        cartSection.classList.toggle("active");
    });

    cartClose.addEventListener("click", () => {
        cartSection.classList.remove("active");
    });

    // Function to clear the cart
    function clearCart() {
        fetch("/cart", {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Cart cleared") {
                    updateCart(); // Refresh the cart display after clearing
                }
            })
            .catch((error) => {
                console.error("Error clearing cart:", error);
            });
    }

    // Add event listeners for cart buttons
    const clearCartButton = document.querySelector(".clear-cart-btn");
    const checkoutButton = document.querySelector(".checkout-btn");
    const payNowButton = document.querySelector(".pay-now-btn");

    if (clearCartButton) {
        clearCartButton.addEventListener("click", clearCart);
    }

    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            handleCheckout(); // Update payment section visibility on checkout
            paymentSectionVisible = true; // Set flag to true when checkout button is clicked
        });
    }

    if (payNowButton) {
        payNowButton.addEventListener("click", () => {
            alert("Payment processing..."); // Replace with actual payment handling
        });
    }
});
