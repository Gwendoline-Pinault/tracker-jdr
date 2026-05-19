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
router.get('/nouvelle-campagne', mainController.newCampaignPage);
router.get('/campagne/:rpg/nouvelle-partie', mainController.newGamePage);

router.post('/add-game/:rpg', mainController.addGame);
router.post('/nouvelle-campagne', mainController.addNewRpg);

module.exports = router;