
const axios = require('axios');
let addToCart = document.querySelectorAll('.add-to-cart');

function updateCart(book) {
  axios.post('/update-cart', book)
    .then(res => {
      console.log(res);
      cartCounter.innerText = res.data.totalQty;
    })
    .catch(err => {
      console.log(err);
    })
}


addToCart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let book = btn.dataset.book;
    book = JSON.parse(book);
    updateCart(book);
  })
});

// Change order status
let statues = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small');

function updateStatus(order) {
  let stepCompleted = true;

  statues.forEach((status) => {
    status.classList.remove('step-comleted');
    status.classList.remove('current');
  })


  statues.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add('step-completed')
    }
    if (dataProp == order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format('hh:mm A');
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add('current');
      }
    }
  });

  if (stepCompleted) {
    statues.forEach((status) => {
      status.classList.remove('step-comleted');
      status.classList.remove('current');
    });
    
  }

}

updateStatus(order);

const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}