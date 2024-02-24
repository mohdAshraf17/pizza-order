// import axios from "axios";
// import moment from 'moment';
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
    fetch('/update-cart', { method: 'post', body: JSON.stringify(pizza), headers }).then(res => res.json()).then(cart => {
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

const alertMsg = document.querySelector('.succes-alert');

if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove();
    }, 1000)
}

const getAllOrders = document.querySelector('.getAllOrders');
let data = [];
let markup;

const parseItem = (items) => {
    let parseitems = Object.values(items);

    return parseitems.map(menuItem => {
        return `
        <p class="c-green">${menuItem.item.name} - ${menuItem.qty} pcs</p>
        `
    }).join('')
}

const generateMarkup = (result) => {
    return result.map(order => {
        return `
        <tr>
               <td>
                    <p class="c-green">${order._id}</p>
                    <div class="c-green">${parseItem(order.items)}</div>
                </td>
                    <td>${order.customerId.name}</td>
                    <td> ${order.phone}</td>
                    <td>${order.address}</td>
                    <td>
                        <div>
                            <form action="/admin/order/status" method="post">
                                <input type="hidden" name="orderId" value="${order._id}">
                                <select class="order-status" name="status" onchange="this.form.submit()">
                                <option value="order_placed" ${order.status == 'order_placed' ? 'selected' : ' '}>Placed</option>
                                <option value="confirmed" ${order.status == 'confirmed' ? 'selected' : ' '}>confirmed</option>
                                <option value="prepared" ${order.status == 'prepared' ? 'selected' : ' '}>prepared</option>
                                <option value="delivered" ${order.status == 'delivered' ? 'selected' : ' '}>delivered</option>
                                <option value="completed" ${order.status == 'completed' ? 'selected' : ' '}>completed</option>
                                </select>
                            </form>
                        </div>
                    </td>
            </tr>
        `
    }).join(' ')
}


const getdata = async () => {
    const res = await fetch('/admin/orders', { headers: { "x-Requested-With": "XMLHttpRequest" } })
    const result = await res.json();
    data = result
    markup = generateMarkup(result);
    getAllOrders.innerHTML = markup;
    console.log(data)
}
const readyData = () => {

}
const whiteLine = document.querySelectorAll('.white-line');
const hiddenInput = document.querySelector('#hiddenInput');
const orders = hiddenInput ? hiddenInput.value : null;
const order = JSON.parse(orders)

const updateStaus = (order) => {
    let stepCompleted = true;
    whiteLine.forEach(status => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    whiteLine.forEach(status => {
        let statusProp = status.dataset.status;
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (statusProp === order.status) {
            stepCompleted = false
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }

    })

}

updateStaus(order)
getdata()

// socket

const socket = io();

if (order) {
    socket.emit('join', `order_${order._id}`)
}

const adminPath = window.location.pathname;

socket.on('orderUpdate', (data) => {
    const updateOrder = { ...order };
    updateOrder.status = data.status;
    updateStaus(updateOrder)
})
