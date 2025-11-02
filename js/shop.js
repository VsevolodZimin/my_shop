import products from './products.json' with { type: 'json' };

const OIL_ID = 1;
const CUPCAKE_MIXTURE_ID = 3;
const CHECKOUT_HREF = 'checkout.html'
let isInitialized = false;
let cart = {
    productList: [],
    total: 0,
};


try {
    initCards();
    function initCards(){
            const groceryContainer = document.getElementById("grocery-card-container");
            const beautyContainer = document.getElementById("beauty-card-container");
            const clothesContainer = document.getElementById("clothes-card-container");
            if(!groceryContainer) throw new Error('groceryContainer not found!')
            if(!beautyContainer) throw new Error('beautyContainer not found!')
            if(!clothesContainer) throw new Error('clothesContainer not found!')

            const groceryElements = products
            .filter(prod => prod.type === 'grocery')
            .map(prod => createProductCard(prod));
        
            const beautyElements = products
            .filter(prod => prod.type === 'beauty')
            .map(prod => createProductCard(prod));

            const clothesElements = products
            .filter(prod => prod.type === 'clothes')
            .map(prod => createProductCard(prod));

            groceryContainer.append(...groceryElements);
            beautyContainer.append(...beautyElements);
            clothesContainer.append(...clothesElements);
    
  
        }



    const cartButton = document.querySelector('.cart-button');
    const cartListHtml = document.getElementById('cart_list');
    const totalHtml = document.getElementById('total_price');
    const checkoutBtn = document.getElementById("checkout-btn");
    const productCount = document.getElementById("count_product");
    const cleanCartBtn = document.getElementById("clean-cart");
    
    if(!cartListHtml) throw new Error('cartList not found!')
    if(!cartButton) throw new Error('cartButton not found!')
    if(!totalHtml) throw new Error('totalHtml not found!')
    if(!checkoutBtn) throw new Error('checkoutBtn not found!')
    if(!productCount) throw new Error('productCount not found!')
    if(!cleanCartBtn) throw new Error('cleanCartBtn not found!')

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
        const row = document.createElement('div');
        const header = document.createElement('div');
        row.classList.add('modal-row');
        header.textContent = product.name;
        const priceCell = createCell(product.price);
        const quantityCell = createInputCell(product.quantity);
        const subtotalCell = createCell(product.subtotal);
        row.append(header, priceCell, quantityCell, subtotalCell);
        quantityCell.addEventListener('input', () => {
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
        const col = document.createElement('div');
        col.textContent = Math.round(Number(text) * 100) / 100;
        return col;
    }

    function createInputCell(text){
        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.classList.add('quantity-input');
        input.setAttribute('min', '0');
        input.setAttribute('max', '50');
        input.value = text;
        return input;
    }

    function updateProductCount(){
        TODO: "CHECK IF NUMBER"
        productCount.textContent = cart.productList.reduce((acc, curr) => acc + curr.quantity, 0);
    }

    function createProductCard(product){
        const element = document.createElement('div');
        element.innerHTML = `<div class="col mb-5">
						<article class="card product-card h-100">
							<img class="card-img-top" src="${product.image}" alt="${product.alt}"
								loading="lazy" />
							<div class="card-body p-4">
								<div class="text-center">
									<h3 class="h5 fw-bolder">${product.name}</h3>
									<p class="price">$${product.price}</p>
								</div>
							</div>
							<div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
								<div class="text-center">
									<button type="button" class="btn btn-outline-dark add-to-cart" data-product-id="${product.id}"
										aria-label="Add ${product.name} to cart">
										Add to cart
									</button>
								</div>
							</div>
						</article>
					</div>`;

        const button = element.querySelector('.add-to-cart');
        button.addEventListener('click', () => {
            try{
                const id = Number(button.dataset.productId);
                if(!id || isNaN(id)) throw new Error('Invalid id')
                buy(id);
                updateProductCount();
                applyPromotionsCart(cart);
            }
            catch(err){
                console.error(err);
                throw err;
            }
        });
        return element
    }

}
catch(err){
    console.error(err);
    throw err;
}

