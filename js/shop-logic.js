import cloneDeep from 'https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/cloneDeep.js';
import productsJSON from './products.json' with { type: 'json' };

const OIL_ID = 1;
const CUPCAKE_MIXTURE_ID = 3;

export const cart = {
    
    productList: [],
    
    buyProduct(id){
        const inCartProduct = this.productList.find(p => p.id === id);
        if(inCartProduct){
            inCartProduct.quantity += 1; 
            inCartProduct.subtotal = inCartProduct.price * inCartProduct.quantity
        }
        else {
            const newProduct = productsJSON.find(p => p.id === id)
            this.productList.push({ ...newProduct, quantity: 1, subtotal: newProduct.price })
        }
    },
    
    removeProduct(id) {
        this.setProductList(cart.productList.filter(p => p.id !== id));
    },

    clear() {
        cart.productList.length = 0;
    },

    setProductList(productList){
        this.productList = productList;
    },

    getTotal() {
        const dirtyTotal = this.productList.reduce((acc, currProd) => acc + currProd.subtotal, 0);
        return `€${(Math.round(dirtyTotal * 100)/100).toFixed(2)}`;
    },

    getProductCount(){
        return this.productList.reduce((acc, curr) => acc + curr.quantity, 0);
    },

    applyPromotions() {
        const oilCartItems = this.productList.find(el => el.id === OIL_ID);
        const cupcakeMixtureCartItems = this.productList.find(el => el.id === CUPCAKE_MIXTURE_ID);

        if(oilCartItems && oilCartItems.quantity > 2){
            oilCartItems.subtotal = calculateDiscount(oilCartItems.price, oilCartItems.quantity, 20);
        }
        if(cupcakeMixtureCartItems && cupcakeMixtureCartItems.quantity > 9) {
            cupcakeMixtureCartItems.subtotal = calculateDiscount(cupcakeMixtureCartItems.price, cupcakeMixtureCartItems.quantity, 30);
        }
    }
};

function calculateDiscount(price, quantity, percentage){
    const dirtyPrice = (price * ((100 - percentage)/100) * quantity); 
    return Math.round(dirtyPrice * 100)/100;
}

export function handleAddToCartButton(addToCartButton){
    try{
        const id = Number(addToCartButton.dataset.productId);
        if(!id || isNaN(id)) throw new Error('Invalid id');
        cart.buyProduct(id)
        cart.applyPromotions();
    }
    catch(err){
        console.error(err);
        throw err;
    }
}

export function handleQuantityButtonCLick(input, productId){
    const product = cart.productList.find(p => p.id === productId);
    product.quantity = Number(input.textContent);
    if(product.quantity === 0){
        cart.removeProduct(product.id)
    }
    product.subtotal = product.price * Number(product.quantity);
    if(product.id === CUPCAKE_MIXTURE_ID || product.id === OIL_ID){
        cart.applyPromotions()
    }
}