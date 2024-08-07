function showAllProducts(products) {
  // forEach
  products.forEach((productData) => newProductCard(productData));
}

function getFilteredProducts(productNames, query) {
  // filter
  const result = productNames.filter((product) => product.toLowerCase() == query.toLowerCase());
  return result;
}

function getConvertedPrices(productPrices, currency) {
  // map
  if (currency == "gbp") {
    const result = productPrices.map((price) => (price * 0.77).toFixed(2));
    return result;
  } else if (currency == "jpy") {
    const result = productPrices.map((price) => (price * 157.44).toFixed(2));
    return result;
  } else {
    return productPrices;
  }
}

function getCartTotal(cartPrices) {
  // reduce
  const total = cartPrices.reduce((sum, price) => sum += price);
  return total;
}

showAllProducts(PRODUCTS);