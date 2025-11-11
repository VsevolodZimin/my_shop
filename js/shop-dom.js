import productsJSON from './products.json' with { type: 'json' };
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/+esm';
import { handleAddToCartButton, handleQuantityButtonCLick, cart } from './shop-logic.js'

const CHECKOUT_HREF = 'checkout.html';

let groceryContainerUI;
let beautyContainerUI;
let clothesContainerUI;
let cartListUI;
let totalUI;
let checkoutBtn;
let clearCartBtn;
let productCountUI;
let cartBtn;

try {
    initCards();
    initModal()
    initNavbar();
}
catch(err){
    console.error(err);
    throw err;
}

function initCards(){
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
        handleAddToCartButton(event.currentTarget, productsJSON, cart.productList);
        setProductCountUI(cart.getProductCount());
    });
    return element;
}

function initModal(){
    cartListUI = document.getElementById('cart_list');
    totalUI = document.getElementById('total-price');
    checkoutBtn = document.getElementById("checkout-btn");
    clearCartBtn = document.getElementById("clean-cart");
    
    if(!cartListUI) throw new Error('cartList not found!');
    if(!totalUI) throw new Error('totalHtml not found!');
    if(!checkoutBtn) throw new Error('checkoutBtn not found!');
    if(!clearCartBtn) throw new Error('cleanCartBtn not found!');
    clearCartBtn.addEventListener('click', () => { 
        cart.clear();
        printCart();
        setProductCountUI(cart.getProductCount());
    });
}

function createRow(product){
    const row = document.createElement('div');
    row.classList.add('modal-row');

    const nameCell = createTextCell(product.name);
    const priceCell = createNumberCell(product.price, '€');
    const quantityCell = createInputCell(product);
    const subtotalCell = createNumberCell(product.subtotal, '€');
    row.append(nameCell, priceCell, quantityCell, subtotalCell);
    return row;
}

function createNumberCell(text, cur){
    if(isNaN(Number(text))) throw new Error ('Cell value is not a number');
    const col = document.createElement('div');
    const val = Math.round(Number(text) * 100) / 100;
    col.textContent = cur ? `${cur}${val.toFixed(2)}` : val;
    return col;
}

function createTextCell(text){
    const col = document.createElement('div');
    col.textContent = text;
    return col;
}

function createInputCell(product){
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('quantity-input-wrapper');
    const input = document.createElement('div');
    input.classList.add('quantity-input');
    const incBtn = document.createElement('button');
    const decBtn = document.createElement('button');
    const btnGroup = document.createElement('div');
    btnGroup.classList.add('quantity-btn-group');
    btnGroup.append(incBtn, decBtn);
    incBtn.classList.add('quantity-btn');
    decBtn.classList.add('quantity-btn');

    incBtn.textContent = '▲';
    decBtn.textContent = '▼';

    input.textContent = product.quantity;
    input.addEventListener('quantity-button-click', (event) => {
        handleQuantityButtonCLick(event.currentTarget, product.id)
        printCart(cart.productList);
        setProductCountUI(cart.getProductCount())
    })
    inputWrapper.append(input, btnGroup); 

    decBtn.addEventListener('click', () => {
        input.textContent = Number(input.textContent) > 0 ? Number(input.textContent) - 1 : 0; 
        input.dispatchEvent(new Event('quantity-button-click'));
    })

    incBtn.addEventListener('click', () => {
        input.textContent = Number(input.textContent) < 50 ? Number(input.textContent) + 1 : 50; 
        input.dispatchEvent(new Event('quantity-button-click'));
    })

    return inputWrapper;
}

function initNavbar(){
    productCountUI = document.getElementById("count_product");
    cartBtn = document.querySelector('.cart-button');
    if(!cartBtn) throw new Error('cartButton not found!')
    if(!productCountUI) throw new Error('productCount not found!');
    cartBtn.addEventListener('click', () => { 
        printCart()
    });
}

function printCart() {
    cart.productList.length > 0 ? activateCheckoutButton() : blockCheckoutButton();
    cartListUI.replaceChildren();
    const rows = cart.productList.map(p => createRow(p));
    cartListUI.append(...rows);
    totalUI.textContent = cart.getTotal();
}

function setProductCountUI(val){
    productCountUI.textContent = val;
} 

function blockCheckoutButton(){
    checkoutBtn.removeAttribute('href');
}

function activateCheckoutButton(){
    checkoutBtn.setAttribute('href', CHECKOUT_HREF);
}