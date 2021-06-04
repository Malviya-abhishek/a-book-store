function initRoutes(app){
  // Home
  app.get('', (req, res)=>{
    return res.render('home')
  });

  //Customers
  app.get('/cart', (req, res)=>{
    return res.render('customers/cart')
  });
}

module.exports = initRoutes;