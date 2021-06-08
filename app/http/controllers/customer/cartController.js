function CartController() {
  return {
    index(req, res) {
      return res.render('customers/cart');
    },
    update(req, res) {

      if (!req.session.cart) {
        req.session.cart = {
          sellers: {},
          totalQty: 0,
          totalPrice: 0
        }
      }

      const cart = req.session.cart;
      const order = req.body;

      if (!cart.sellers[order.sellerId])
        cart.sellers[order.sellerId] = {};

      if (!cart.sellers[order.sellerId][order._id])
        cart.sellers[order.sellerId][order._id] = {
          qty: 0,
          order:order
        }

      cart.sellers[order.sellerId][order._id].qty += 1;
      cart.totalQty += 1;
      cart.totalPrice += 1.0 * order.price;


      return res.json({ totalQty: cart.totalQty });
    }
  }
}

module.exports = CartController;