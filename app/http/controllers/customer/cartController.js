function CartController() {
  return {
    index(req, res) {
      return res.render('customers/cart');
    },
    update(req, res) {

      if (!req.session.cart) {
        req.session.cart = {
          orders: {},
          totalQty: 0,
          totalPrice: 0
        }
      }

      const cart = req.session.cart;
      const book = req.body;

      console.log(book);

      if (!cart.orders[book.sellerId])
        cart.orders[book.sellerId] = {};

      if (!cart.orders[book.sellerId][book._id])
        cart.orders[book.sellerId][book._id] = {
          qty: 0,
          book:book
        }

      cart.orders[book.sellerId][book._id].qty += 1;
      cart.totalQty += 1;
      cart.totalPrice += 1.0 * book.price;

       

      return res.json({ totalQty: cart.totalQty});
    }
  }
}

module.exports = CartController;