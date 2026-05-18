const { Router } = require('express');
const mainController = require('./controllers/mainController');
const authController = require('./controllers/authController');
const router = Router();


router.get('/', mainController.home);
router.get('/campagne/:rpg', mainController.rpgPage);
router.get('/campagne/:rpg/details/:character', mainController.characterPage);

// login routes
router.get('/connexion', authController.loginPage);
router.get('/logout', authController.logout);
router.post('/login', authController.login);

// protected routes
router.get('/nouvelle-campagne', async (req, res) => {
  const isAdmin = await authController.isAdmin;
  
  if (isAdmin) mainController.addNewRpg;
  else res.redirect('/');
});
router.get('/campagne/:rpg/nouvelle-partie', async (req, res) => {
  const isAdmin = await authController.isAdmin;
  
  if (isAdmin) mainController.newGamePage;
  else res.redirect('/');
});

router.post('/add-game/:rpg', async (req, res) => {
  const isAdmin = await authController.isAdmin;
  
  if (isAdmin) mainController.addGame;
  else res.redirect('/');
});

module.exports = router;