import axios from "axios";

export const BASE_URL = "http://localhost:8000";

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

export async function getNavItems(callback = (data) => {}) {
    axios.get('/api/navitems').then(res => {
        callback(res.data);
    }).catch((e) => {
        console.error(e);
    });
}

export async function getDesignSymbols(callback = (data) => {}) {
    axios.get('/api/designsymbols').then(res => {
        callback(res.data);
    }).catch((e) => {
        console.error(e);
    });
}

export async function getProducts(callback = (data) => {}) {
    axios.get('/api/products').then(res => {
        callback(res.data);
    }).catch((e) => {
        console.error(e);
    });
}

export async function getColors(callback = (data) => {}) {
    axios.get('/api/colors').then(res => {
        callback(res.data);
    }).catch((e) => {
        console.error(e);
    });
}

export function getCart() {
    const items = localStorage.getItem('cart');
    if (items && items.length > 0) {
        return JSON.parse(items);
    } else {
        return []
    }
}

export function saveCart(items) {
    localStorage.setItem('cart', JSON.stringify(items))
}

export function addToCart(item) {
    const items = getCart();
    const newItems = [...items, item];
    saveCart(newItems);
}

export async function orderCart(items, contactInformation) {
    if (items.length > 0) {
        axios.post('/api/order', {
            items: items,
            ...contactInformation
        }).then(res => {
            saveCart([]);
        }).catch((e) => {
            console.error(e);
        });
    }
}