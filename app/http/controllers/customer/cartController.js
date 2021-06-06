function CartController() {
  return {
    index(req, res) {
      return res.render('customers/cart')
    },
  }
}

module.exports = CartController;