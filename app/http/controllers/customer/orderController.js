const Order = require('../../../model/order');
const moment = require('moment');

function orderController() {
  return {

    store(req, res) {
      const { phone, address } = req.body;

      //Validate request
      if (!phone || !address) {
        req.flash('error', 'All fields are required');
        return res.redirect('cart');
      }

      // Making order
      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: address
      });

      order.save()
        .then(result => {
          req.flash('success', 'Order placed succesfully');
          delete req.session.cart

          // Emit event for order update
          Order.populate(result, { path: 'customerId', select: '-password' }, (err, placedOrder) => {
            // const eventEmitter = req.app.get('eventEmitter');
            // eventEmitter.emit('orderPlaced', result);
            return res.redirect('/customer/orders');
          });


        })
        .catch(err => {
          req.flash('error', 'Something went wrong')
          return res.redirect('/cart');
        })
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
    }


  }
}

module.exports = orderController;