// const upload = require('../../../config/multer');

const multer = require('multer');
const path = require('path')
const sharp = require('sharp');
const fs = require('fs');
const Book = require('../../../model/book');
const Order = require('../../../model/order');
const moment = require('moment');


const storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, 'public/uploads')
  },
  filename: function (req, file, callBack) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = '.jpg'
    callBack(null, uniqueSuffix + extension)
  },
});


const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callBack) {
    let ext = path.extname(file.originalname);

    if (!req.body.bookName)
      return callBack(new Error('Book Name required'));

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg')
      return callBack(new Error('Only images are allowed'));

    return callBack(null, true);
  }
}).single('file-to-upload');


function sellerController() {
  return {
    uploadBook(req, res) {
      return res.render('sellers/uploadBook')
    },
    postUploadBook(req, res) {

      upload(req, res, async (err) => {
        if (err) {
          req.flash('error', err.message);
          return res.render('sellers/uploadBook');
        }
        else {

          const fileLocation = path.resolve(req.file.destination, 'images', req.file.filename);

          await sharp(req.file.path)
            .resize(240, 384)
            .jpeg({ quality: 90 })
            .toFile(
              fileLocation
            ).catch((err) => {
              console.log(err);
              req.flash('error', 'something went wrong');
              fs.unlinkSync(req.file.path);
              return res.render('sellers/uploadBook');
            });

          fs.unlinkSync(req.file.path);
          const { bookName, description, tags, price } = req.body;

          const book = new Book({
            name: bookName,
            description: description,
            image: 'uploads/images/' + req.file.filename,
            tags: tags.split(' '),
            sellerId: req.user,
            price: price
          });


          book.save()
            .then(() => {
              return res.redirect('/');
            })
            .catch((err) => {
              req.flash('error', 'Something went Wrong')
              return res.render('sellers/uploadBook');
            });

        }
      });
    },
    async show(req, res) {

      const ordersRaw = await Order.find( {}, null, { sort: { 'createdAt': -1 } });
      const orders = []


      ordersRaw.forEach(order => {

        Object.keys(order.items).map((key) => {
          if(order.items[key].item.sellerId != req.user._id){
            delete order.items[key];
          }
        });

        if(Object.entries(order.items).length)
          orders.push(order)
        
      });

      res.header(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
      );

      res.render('customers/orders', { orders: orders, moment: moment });

    },
  };
}

module.exports = sellerController;

// {
//   '60bceb97e1c09ea13b477626': {
//     qty: 1,
//     item: {
//       tags: [Array],
//       image: 'uploads/images/1622993815363-129889977.jpg',
//       _id: '60bceb97e1c09ea13b477626',
//       name: ' Little Town 2',
//       description: 'asd asd asd ',
//       sellerId: '60bbe508b60932021a0ee2ee',
//       price: 321,
//       __v: 0
//     }
//   },
//   '60bceaad6b833f9f7f448ca0': {
//     qty: 1,
//     item: {
//       tags: [Array],
//       image: 'uploads/images/1622993581959-9915384.jpg',
//       _id: '60bceaad6b833f9f7f448ca0',
//       name: ' Little Town',
//       description: 'qwe qwe qwe qwe ',
//       price: 123,
//       __v: 0
//     }
//   }
// }
// -------------
// {
//   '60bd02f3634770ad373789fa': {
//     qty: 1,
//     item: {
//       tags: [Array],
//       image: 'uploads/images/1622999795713-358050034.jpg',
//       _id: '60bd02f3634770ad373789fa',
//       name: ' Little Town 3',
//       description: 'This is little town three',
//       sellerId: '60bbe508b60932021a0ee2ee',
//       price: 345,
//       __v: 0
//     }
//   }
// }
// -------------
// {
//   '60bceaad6b833f9f7f448ca0': {
//     qty: 1,
//     item: {
//       tags: [Array],
//       image: 'uploads/images/1622993581959-9915384.jpg',
//       _id: '60bceaad6b833f9f7f448ca0',
//       name: ' Little Town',
//       description: 'qwe qwe qwe qwe ',
//       price: 123,
//       __v: 0
//     }
//   },
//   '60bceb97e1c09ea13b477626': {
//     qty: 1,
//     item: {
//       tags: [Array],
//       image: 'uploads/images/1622993815363-129889977.jpg',
//       _id: '60bceb97e1c09ea13b477626',
//       name: ' Little Town 2',
//       description: 'asd asd asd ',
//       sellerId: '60bbe508b60932021a0ee2ee',
//       price: 321,
//       __v: 0
//     }
//   },
//   '60bd02f3634770ad373789fa': {
//     qty: 1,
//     item: {
//       tags: [Array],
//       image: 'uploads/images/1622999795713-358050034.jpg',
//       _id: '60bd02f3634770ad373789fa',
//       name: ' Little Town 3',
//       description: 'This is little town three',
//       sellerId: '60bbe508b60932021a0ee2ee',
//       price: 345,
//       __v: 0
//     }
//   }
// }
// -------------
// {
//   '60bceaad6b833f9f7f448ca0': {
//     qty: 2,
//     item: {
//       tags: [Array],
//       image: 'uploads/images/1622993581959-9915384.jpg',
//       _id: '60bceaad6b833f9f7f448ca0',
//       name: ' Little Town',
//       description: 'qwe qwe qwe qwe ',
//       price: 123,
//       __v: 0
//     }
//   }
// }
// -------------
// {
//   '60bceb97e1c09ea13b477626': {
//     qty: 1,
//     item: {
//       tags: [Array],
//       image: 'uploads/images/1622993815363-129889977.jpg',
//       _id: '60bceb97e1c09ea13b477626',
//       name: ' Little Town 2',
//       description: 'asd asd asd ',
//       sellerId: '60bbe508b60932021a0ee2ee',
//       price: 321,
//       __v: 0
//     }
//   },
//   '60bceaad6b833f9f7f448ca0': {
//     qty: 1,
//     item: {
//       tags: [Array],
//       image: 'uploads/images/1622993581959-9915384.jpg',
//       _id: '60bceaad6b833f9f7f448ca0',
//       name: ' Little Town',
//       description: 'qwe qwe qwe qwe ',
//       price: 123,
//       __v: 0
//     }
//   }
// }
// -------------
// {
//   '60bceb97e1c09ea13b477626': {
//     qty: 1,
//     item: {
//       tags: [Array],
//       image: 'uploads/images/1622993815363-129889977.jpg',
//       _id: '60bceb97e1c09ea13b477626',
//       name: ' Little Town 2',
//       description: 'asd asd asd ',
//       sellerId: '60bbe508b60932021a0ee2ee',
//       price: 321,
//       __v: 0
//     }
//   }
// }