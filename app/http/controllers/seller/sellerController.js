// const upload = require('../../../config/multer');

const multer = require('multer');
const path = require('path')


const storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, 'public/uploads')
  },
  filename: function (req, file, callBack) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = '.jpg'
    callBack(null, req.body.name + '-' + uniqueSuffix + extension)
  },
})

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callBack) {
    console.log("[fileFilter]", file.mimetype);
    let ext = path.extname(file.originalname);

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      callBack(new Error('Only images are allowed'));
    }

    callBack(null, true);
  }
}).single('file-to-upload');




function sellerController() {
  return {
    uploadBook(req, res) {
      return res.render('sellers/uploadBook')
    },
    postUploadBook(req, res) {

      upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log(err);
        }
        else if (err) {
          console.log(err);
        }
      });

      req.flash('error', 'somthing went wrong');
      return res.render('sellers/uploadBook');
    }
  };
}

module.exports = sellerController;