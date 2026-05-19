const dataMapper = require("../models/datamapper");

const authController = {
  loginPage: (req, res) => {
    const rpgList = dataMapper.rpgList();
    const error = null;
    const username = req.session?.username;

    res.render('loginPage', { rpgList, error, username });
  },
  login: async (req, res) => {
    const form = await req.body;
    const rpgList = dataMapper.rpgList();
    const username = req.session?.username;

    if (form.username === process.env.IDENTIFIANT && form.password === process.env.PASSWORD) {
      req.session.username = form.username;
      req.session.save();

      res.redirect('/');
    } else {
      const error = "Utilisateur inconnu.";

      res.render('loginPage.ejs', { rpgList, error, username })
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  },
  isAdmin: (req, res) => {
    const username = req.session.username;
    const password = req.session.password;

    if (username === process.env.IDENTIFIANT && password === process.env.PASSWORD) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = authController;