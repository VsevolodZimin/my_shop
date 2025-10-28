import products from './products.json' with { type: 'json' };

const OIL_ID = 1;
const CUPCAKE_MIXTURE_ID = 3;
const CHECKOUT_HREF = 'checkout.html'
let cart = {
    productList: [],
    total: 0,
};

try {
    const buttons = document.querySelectorAll('.add-to-cart');
    const cartButton = document.querySelector('.cart-button');
    const cartListHtml = document.getElementById('cart_list');
    const totalHtml = document.getElementById('total_price');
    const checkoutBtn = document.getElementById("checkout-btn");
    const productCount = document.getElementById("count_product");
    const cleanCartBtn = document.getElementById("clean-cart");

    if(!buttons) throw new Error('buttons not found!')
    if(!cartListHtml) throw new Error('cartList not found!')
    if(!cartButton) throw new Error('cartButton not found!')
    if(!totalHtml) throw new Error('totalHtml not found!')
    if(!checkoutBtn) throw new Error('checkoutBtn not found!')
    if(!productCount) throw new Error('productCount not found!')
    if(!cleanCartBtn) throw new Error('cleanCartBtn not found!')

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            try{
                const id = Number(btn.dataset.productId);
                if(!id || isNaN(id)) throw new Error('Invalid id')
                buy(id);
                updateProductCount();
                applyPromotionsCart(cart);
            }
            catch(err){
                console.error(err);
                throw err;
            }
        })
    })

    cartButton.addEventListener('click', () => { 
        printCart(cart.productList)
    });

    cleanCartBtn.addEventListener('click', () => { 
        cleanCart();
        printCart(cart.productList)
    });

    // Exercise 1
    const buy = (id) => {
        const cartItem = cart.productList.find(p => p.id === id);
        if(cartItem){
            cartItem.quantity += 1; 
            cartItem.subtotal = cartItem.price * cartItem.quantity
        }
        else {
            const product = products.find(p => p.id === id)
            cart.productList.push({ ...product, quantity: 1, subtotal: product.price })
        }
        console.log(cart.productList);
    }

    // Exercise 2
    function cleanCart() {
        cart.productList.length = 0;
        productCount.textContent = 0;
    }

    // Exercise 3
    function calculateTotal(cart) {
        const rawTotal = cart.total = cart.productList.reduce((acc, currProd) => acc + currProd.subtotal, 0);
        return Math.round(rawTotal * 100)/100;
    }

    // Exercise 4
    const applyPromotionsCart = (cart) =>  {
        const oil = cart.productList.find(el => el.id === OIL_ID);
        const cupcakeMixture = cart.productList.find(el => el.id === CUPCAKE_MIXTURE_ID);

        if(oil && oil.quantity > 2){
            oil.subtotal = calcSubtotalWithDiscount(oil, 20);
        }
        if(cupcakeMixture && cupcakeMixture.quantity > 9) {
            cupcakeMixture.subtotal = calcSubtotalWithDiscount(cupcakeMixture, 30);
        }
    }

    // Exercise 5
    function printCart(productList) {
        blockcheckoutButton(productList);
        updateProductCount();
        cartListHtml.replaceChildren();
        const rows = productList.map(p => createRow(p));
        cartListHtml.append(...rows);
        totalHtml.textContent = calculateTotal(cart);
    }

    // ** Nivell II **

    // Exercise 7
    const removeFromCart = (pCart, id) => {
        pCart.productList = pCart.productList.filter(p => p.id !== id)};


    function calcSubtotalWithDiscount(product, percentage){
        // Floating point calculations might yield an invalid price (e.g. 18.14000000000000003) 
        const rawPrice = (product.price * ((100 - percentage)/100) * product.quantity); 
        return Math.round(rawPrice * 100)/100;
    }

    function blockcheckoutButton(productList){
	    if(productList.length === 0) {
            checkoutBtn.removeAttribute('href');
        }
        else {
            checkoutBtn.setAttribute('href', CHECKOUT_HREF);
        }
    }

    function createRow(product){
        const row = document.createElement('tr');
        const header = document.createElement('th');
        header.setAttribute('scope', 'col')
        header.textContent = product.name;
        const priceCell = createCell(product.price);
        const quantityCell = createInputCell(product.quantity);
        const subtotalCell = createCell(product.subtotal);
        row.append(header, priceCell, quantityCell, subtotalCell);
        quantityCell.addEventListener('blur', () => {
            product.quantity = Number(quantityCell.value);
            if(product.quantity === 0){
                removeFromCart(cart, product.id)
            }
            product.subtotal = product.price * Number(product.quantity);
            if(product.id === CUPCAKE_MIXTURE_ID || product.id === OIL_ID){
                applyPromotionsCart(cart)
            }
            printCart(cart.productList);
        })
        return row;
    }
    
    function createCell(text){
        if(isNaN(Number(text))) throw new Error ('Cell value is not a number');
        const col = document.createElement('td');
        col.textContent = Math.round(Number(text) * 100) / 100;
        return col;
    }

    function createInputCell(text){
        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('min', '0');
        input.setAttribute('max', '50');
        input.value = text;
        return input;
    }

    function updateProductCount(){
        TODO: "CHECK IF NUMBER"
        productCount.textContent = cart.productList.reduce((acc, curr) => acc + curr.quantity, 0);
    }
}
catch(err){
    console.error(err);
    throw err;
}