const HomeController = require('../app/http/controllers/homeController')
const CartController = require('../app/http/controllers/customer/cartController')
const AuthController = require('../app/http/controllers/authController');
const SellerController =require('../app/http/controllers/seller/sellerController');
const OrderController = require('../app/http/controllers/customer/orderController');
// Middlerware
const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');
const customer = require('../app/http/middleware/customer');
const seller = require('../app/http/middleware/seller');
const admin = require('../app/http/middleware/admin');


// Config for file upload


function initRoutes(app){
  // Home
  app.get('', HomeController().index);

  // Auth
  app.get('/login', guest, AuthController().login);
  app.post('/login',guest, AuthController().postLogin);
  app.get('/register', guest, AuthController().register);
  app.post('/register',guest, AuthController().postRegister);
  app.post('/logout',auth, AuthController().postLogout);

  // seller
  app.get('/seller/upload-book', seller, SellerController().uploadBook);
  app.post('/seller/upload-book', seller, SellerController().postUploadBook);
  app.get('/seller/orders', seller, SellerController().show);
  
  
  // customer
  app.get('/cart', CartController().index);
  app.post('/update-cart', CartController().update);
  app.post('/orders', auth, OrderController().store);
  app.get('/customer/orders', auth, OrderController().index);
  app.get('/customer/order/:id', auth, OrderController().show);
  
}

module.exports = initRoutes;

