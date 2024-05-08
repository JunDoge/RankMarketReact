export function viewProduct(product) {
    let viewedProducts = localStorage.getItem('viewedProducts');
    viewedProducts = viewedProducts ? JSON.parse(viewedProducts) : [];
    viewedProducts.push(product);
    while (viewedProducts.length > 5) {
        viewedProducts.shift();
    }
    localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
}