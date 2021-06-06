function HomeController() {
  return {
    index(req, res) {
      // console.log(req.session);
      return res.render('home')
    },
  }
}

module.exports = HomeController;