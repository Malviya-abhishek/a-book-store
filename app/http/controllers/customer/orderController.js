const Order = require('../../../model/order');
const moment = require('moment');

function orderController() {
  return {

    async store(req, res) {
      const { phone, address } = req.body;

      //Validate request
      if (!phone || !address) {
        req.flash('error', 'All fields are required');
        return res.redirect('cart');
      }

      const orders = [];

      Object.keys(req.session.cart.orders).map((key) => {

        const temp = req.session.cart.orders[key];

        const order = {
          customerId: req.user._id,
          sellerId: key,
          status: 0,
          books: [],
          phone: phone,
          address: address
        };


        Object.keys(temp).map((key) => {
          const book = {
            qty: temp[key].qty,
            book: key
          };
          order.books.push(book);
        })

        orders.push(order);

      });

      // Making order
      for (let i = 0; i < orders.length; ++i) {
        const newOrder = new Order(orders[i]);
        newOrder.save(
          function (err) {
            if (err) {
              console.log(err);
              flag = true;
              req.flash('error', 'Something went wrong');
              return res.redirect('/cart');
            }
          }
        );
      }
      
      req.flash('success', 'Order placed succesfully');
      delete req.session.cart;
     
      return res.redirect('/customer/orders');
      
    },

    async index(req, res) {

      if (req.user.role === 'admin')
        return res.redirect('/admin/orders')

      const orders = await Order.find({ customerId: req.user._id },
        null,
        { sort: { 'createdAt': -1 } });
      res.header(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
      );
      res.render('customers/orders', { orders: orders, moment: moment });
    },

    async show(req, res) {
      const order = await Order.findById(req.params.id);


      // Authorise user
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render('customers/singleOrder', { order: order });
      }
      
      return res.redirect('/');
    },




  }
}

module.exports = orderController;