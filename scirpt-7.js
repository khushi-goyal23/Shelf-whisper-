document.addEventListener("DOMContentLoaded", function() {
    // Ensure the DOM is fully loaded before running the script
    const addToCartButton = document.getElementById("addToCartButton");

    if (addToCartButton) {
        addToCartButton.addEventListener("click", function() {
            // Alert when the button is clicked
            alert("Harry Potter and the Philosopher's Stone has been added to your cart!");
            
            // Redirect to the cart page after clicking
            window.location.href = "cart.html";
        });
    } else {
        console.log("Add to Cart button not found!");
    }
});
