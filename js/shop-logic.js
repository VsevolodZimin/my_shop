import productsJSON from './products.json' with { type: 'json' };
import cloneDeep from 'https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/cloneDeep.js';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/+esm';

export let cart = {
    productList: [],
    total: 0,
};

let groceryContainerUI = document.getElementById("grocery-card-container");
let beautyContainerUI = document.getElementById("beauty-card-container");
let clothesContainerUI = document.getElementById("clothes-card-container");
let cartListUI = document.getElementById('cart_list');
let totalUI = document.getElementById('total-price');
let checkoutBtn = document.getElementById("checkout-btn");
let cleanCartBtn = document.getElementById("clean-cart");
let productCountUI = document.getElementById("count_product");
let cartBtn = document.querySelector('.cart-button');

const OIL_ID = 1;
const CUPCAKE_MIXTURE_ID = 3;

try {
    initCards(productsJSON, cart);
    initModal()
    initNavbar();
}
catch(err){
    console.error(err);
    throw err;
}

// UI
function initNavbar(){
    productCountUI = document.getElementById("count_product");
    cartBtn = document.querySelector('.cart-button');
    if(!cartBtn) throw new Error('cartButton not found!')
    if(!productCountUI) throw new Error('productCount not found!');
    cartBtn.addEventListener('click', () => { 
        printCart(cart.productList)
    });
}

// LOGIC
export function buy(products, cartProducts, id){
    const newCartProducts = cloneDeep(cartProducts);
    const cartItem = newCartProducts.find(p => p.id === id);
    if(cartItem){
        cartItem.quantity += 1; 
        cartItem.subtotal = cartItem.price * cartItem.quantity
    }
    else {
        const product = products.find(p => p.id === id)
        newCartProducts.push({ ...product, quantity: 1, subtotal: product.price })
    }
    return newCartProducts;
}

// LOGIC
export function cleanCart(cartProducts) {
    const newCartProducts = cloneDeep(cartProducts);
    newCartProducts.length = 0;
    return newCartProducts;
}

// UI
export function updateProductCountUI(count) {
    productCountUI.textContent = count;
}

// LOGIC
export function getProductCount(cartProducts){
    return cartProducts.reduce((acc, curr) => acc + curr.quantity, 0);
}

// UI
function createRow(product){
    const row = document.createElement('div');
    const header = document.createElement('div');
    row.classList.add('modal-row');
    header.textContent = product.name;
    const priceCell = createRegularCell(product.price, '€');
    const quantityCell = createInputCell(product);
    const subtotalCell = createRegularCell(product.subtotal, '€');
    row.append(header, priceCell, quantityCell, subtotalCell);
    return row;
}


// LOGIC
function calculateTotal(cartProducts, total) {
    const rawTotal = cartProducts.reduce((acc, currProd) => acc + currProd.subtotal, 0);
    total = rawTotal;
    return `€${(Math.round(rawTotal * 100)/100).toFixed(2)}`;
}


//  LOGIC
export function applyPromotions(cartProducts) {
    const newCartProducts = cloneDeep(cartProducts);
    const oilCartItems = newCartProducts.find(el => el.id === OIL_ID);
    const cupcakeMixtureCartItems = newCartProducts.find(el => el.id === CUPCAKE_MIXTURE_ID);

    if(oilCartItems && oilCartItems.quantity > 2){
        oilCartItems.subtotal = calcSubtotalWithDiscount(oilCartItems, 20);
    }
    if(cupcakeMixtureCartItems && cupcakeMixtureCartItems.quantity > 9) {
        cupcakeMixtureCartItems.subtotal = calcSubtotalWithDiscount(cupcakeMixtureCartItems, 30);
    }
    return newCartProducts;
}

// LOGIC
function removeFromCart(cartProducts, id) {
    return cartProducts.filter(p => p.id !== id)
};

// LOGIC
function calcSubtotalWithDiscount(product, percentage){
    const dirtyPrice = (product.price * ((100 - percentage)/100) * product.quantity); 
    return Math.round(dirtyPrice * 100)/100;
}

// UI
function initModal(){
    cartListUI = document.getElementById('cart_list');
    totalUI = document.getElementById('total-price');
    checkoutBtn = document.getElementById("checkout-btn");
    cleanCartBtn = document.getElementById("clean-cart");
    
    if(!cartListUI) throw new Error('cartList not found!');
    if(!totalUI) throw new Error('totalHtml not found!');
    if(!checkoutBtn) throw new Error('checkoutBtn not found!');
    if(!cleanCartBtn) throw new Error('cleanCartBtn not found!');
    cleanCartBtn.addEventListener('click', () => { 
        cleanCart(productCountUI);
        printCart(cart.productList)
    });
}

// UI
function printCart(productList, productCount) {
    blockcheckoutButton(productList);
    getProductCount(productList, productCount);
    cartListUI.replaceChildren();
    const rows = productList.map(p => createRow(p));
    cartListUI.append(...rows);
    totalUI.textContent = calculateTotal(cart);
}


export function createProductCard(productsJSON, product){
    const element = document.createElement('div');
    element.innerHTML = `<div class="col mb-5">
                    <article class="card product-card h-100">
                        <img class="card-img-top" src="${DOMPurify.sanitize(product.image)}" alt="${DOMPurify.sanitize(product.alt)}"
                            loading="lazy" />
                        <div class="card-body p-4">
                            <div class="text-center">
                                <h3 class="h5 fw-bolder">${DOMPurify.sanitize(product.name)}</h3>
                                <p class="price">€${DOMPurify.sanitize(product.price.toFixed(2))}</p>
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <button type="button" class="btn btn-outline-dark add-to-cart" data-product-id="${DOMPurify.sanitize(product.id)}"
                                    aria-label="Add ${DOMPurify.sanitize(product.name)} to cart">
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </article>
                </div>`;

    const addToCartButton = element.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', (event) => {
        cart = handleAddToCartButton(event.currentTarget, productsJSON, cart);
        setProductCountUI(getProductCount(cart.productList));
    });
    return element
}

function initCards(productsJSON, cart){
    groceryContainerUI = document.getElementById("grocery-card-container");
    beautyContainerUI = document.getElementById("beauty-card-container");
    clothesContainerUI = document.getElementById("clothes-card-container");
    if(!groceryContainerUI) throw new Error('groceryContainer not found!')
    if(!beautyContainerUI) throw new Error('beautyContainer not found!')
    if(!clothesContainerUI) throw new Error('clothesContainer not found!')

    const groceryElements = productsJSON
    .filter(prod => prod.type === 'grocery')
    .map(prod => createProductCard(productsJSON, prod));

    const beautyElements = productsJSON
    .filter(prod => prod.type === 'beauty')
    .map(prod => createProductCard(productsJSON, prod));

    const clothesElements = productsJSON
    .filter(prod => prod.type === 'clothes')
    .map(prod => createProductCard(productsJSON, prod));

    groceryContainerUI.append(...groceryElements);
    beautyContainerUI.append(...beautyElements);
    clothesContainerUI.append(...clothesElements);
}

function setProductCountUI(val){
    productCountUI.textContent = val;
} 

function handleAddToCartButton(addToCartButton, productsJSON, cart){
    const newCart = cloneDeep(cart);
    try{
        const id = Number(addToCartButton.dataset.productId);
        if(!id || isNaN(id)) throw new Error('Invalid id');
        let newCartProducts = buy(productsJSON, newCart.productList, id)
        newCartProducts = applyPromotions(newCartProducts);
        return { ...newCart, productList: newCartProducts }
    }
    catch(err){
        console.error(err);
        throw err;
    }
}

function blockcheckoutButton(cartList, checkoutButton){
    if(!cartList.length) checkoutBtn.disabled = true;
};