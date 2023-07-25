// import axios from "axios";
// const axios = require('axios')
const add = document.querySelectorAll('.add');
const qtyCounter = document.querySelector('.qty-counter')

const updateCart = (pizza) => {
    // axios.post('/update-cart', pizza).then(res => {
    //     console.log(res)
    // })
    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/update-cart', { method: 'post', body: JSON.stringify(pizza), headers}).then(res => res.json()).then(cart => {
        console.log(cart.totalQty)
        qtyCounter.innerText = cart.totalQty
    })
}

add.forEach(btn => {
    btn.addEventListener('click', () => {
        const pizza = JSON.parse(btn.dataset.menu)
        // console.log(pizza)
        updateCart(pizza);
    })
})