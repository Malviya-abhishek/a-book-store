const Book = require('../../model/book');

function HomeController() {
  return {
    async index(req, res) {
      const books = await Book.find();
      return res.render('home', {books: books})
    },
  }
}

module.exports = HomeController;