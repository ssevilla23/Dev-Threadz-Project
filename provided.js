// array for storing the prices of items in the cart
let cartPrices = [];
let selectedCurrency = "usd";

function newProductCard(productData) {
  let col = document.createElement("div");
  col.classList.add("col");

  let card = document.createElement("div");
  card.classList.add("card", "h-100");

  let productImage = document.createElement("img");
  productImage.src = productData.src;
  productImage.classList.add("card-img-top", "mb-auto");
  card.appendChild(productImage);

  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "d-flex", "flex-column");
  card.appendChild(cardBody);

  let productName = document.createElement("h3");
  productName.innerText = productData.name;
  productName.classList.add("product-name");
  cardBody.appendChild(productName);

  let productPrice = document.createElement("p");
  productPrice.classList.add("h4", "product-price");
  productPrice.innerText = formatProductPrice(
    productData.price,
    selectedCurrency
  );
  cardBody.appendChild(productPrice);

  let productDescription = document.createElement("p");
  productDescription.innerText =
    productData.description.length > 50
      ? productData.description.slice(0, 50) + "..."
      : productData.description;
  cardBody.appendChild(productDescription);

  let addToCart = document.createElement("button");
  addToCart.classList.add("btn", "btn-primary", "mt-auto");
  addToCart.innerText = "Add to Cart";
  addToCart.onclick = function () {
    this.innerText = "In Cart";
    this.classList = "btn btn-secondary disabled mt-auto";
    // store amount in cart total
    cartPrices.push(productData.price);

    // create new cart item container card
    let cartItemCard = document.createElement("div");
    cartItemCard.classList.add("cart-item", "mb-1");

    // add product image thumbnail and append to card
    let cartItemThumb = document.createElement("img");
    cartItemThumb.src = productData.src;
    cartItemThumb.alt = productData.altText;
    cartItemThumb.classList.add("thumbnail");
    cartItemCard.appendChild(cartItemThumb);

    // add product name and append to card
    let productName = document.createElement("strong");
    productName.innerText = productData.name;
    cartItemCard.appendChild(productName);

    // add product price and append to card
    let price = document.createElement("p");
    price.classList.add("cart-price");
    let convertedPrice = getConvertedPrices(
      [productData.price],
      selectedCurrency
    );
    price.innerText = formatProductPrice(convertedPrice, selectedCurrency);
    cartItemCard.appendChild(price);

    // append card to cart items container
    document.querySelector(".cart-items-container").appendChild(cartItemCard);
    let convertedCartTotal = getConvertedPrices(
      [getCartTotal(cartPrices)],
      selectedCurrency
    );
    // update cart total
    document.querySelector("#cart-total").innerText = formatProductPrice(
      convertedCartTotal,
      selectedCurrency
    );
    // display cart-badge
    let cartBadge = document.querySelector("#cart-badge");
    if (cartBadge.classList.contains("visually-hidden")) {
      cartBadge.classList.remove("visually-hidden");
    }
  };
  // append card to cart body
  cardBody.appendChild(addToCart);
  // append card to col
  col.appendChild(card);
  // append col to products container
  document.querySelector("#products-container").appendChild(col);
}

function formatProductPrice(price, currency) {
  if (currency === "usd") {
    return "$" + price;
  } else if (currency === "gbp") {
    return price + "£";
  } else if (currency === "jpy") {
    return price + "¥";
  } else {
    return price + "—";
  }
}

// searchbar event listener
document.querySelector("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    let query = document.querySelector("#search-input").value;
    let nameMatches = getFilteredProducts(
      PRODUCTS.map((product) => product.name),
      query
    );
    document.querySelector("#products-container").innerHTML = "";
    let matchingProducts = PRODUCTS.filter((product) =>
      nameMatches.includes(product.name)
    );
    matchingProducts.forEach((product) => newProductCard(product));
  } catch (err) {
    console.error("Failed to filter products by search query! Check your getFilteredProducts logic in script.js")
  }
});

// render all products when search input is cleared
document.querySelector("#search-input").addEventListener("change", (e) => {
  if (e.target.value.length === 0) {
    document.querySelector("#products-container").innerHTML = "";
    showAllProducts(PRODUCTS);
  }
});

// change selectedCurrency global and update product prices on select change
document.querySelector("#currency-select").addEventListener("change", (e) => {
  let newCurrency = e.target.value;
  selectedCurrency = newCurrency;
  try {
    // convert denominations of product listings not including cart items
    let convertedListingPrices = getConvertedPrices(
      PRODUCTS.map((product) => product.price),
      newCurrency
    );
    // update denomination listing product prices in DOM
    let displayPrices = [...document.querySelectorAll(".product-price")];
    displayPrices.map((product, idx) => {
      return (product.innerText = formatProductPrice(
        convertedListingPrices[idx],
        selectedCurrency
      ));
    });
    let convertedCartPrices = getConvertedPrices(cartPrices, newCurrency);
    let cartPriceElements = [...document.querySelectorAll(".cart-price")];
    cartPriceElements.map((element, idx) => {
      return (element.innerText = formatProductPrice(
        convertedCartPrices[idx],
        selectedCurrency
      ));
    });
    
    let convertedCartTotal =
      cartPrices.length !== 0
        ? getConvertedPrices([getCartTotal(cartPrices)], selectedCurrency)
        : 0;
    document.querySelector("#cart-total").innerText = formatProductPrice(
      convertedCartTotal,
      selectedCurrency
    );
  } catch(error) {
    console.error("Failed to convert currency! Check your getConvertedPrices logic in script.js!");
  }

});
