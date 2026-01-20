const { Router } = require('express');
const mainController = require('./controllers/mainController');
const authController = require('./controllers/authController');
const router = Router();


router.get('/', mainController.home);
router.get('/campagne/:rpg', mainController.rpgPage);
router.get('/campagne/:rpg/details/:character', mainController.characterPage);
router.get('/campagne/:rpg/nouvelle-partie', mainController.newGamePage);
router.get('/login-page', authController.loginPage);
router.get('/logout', authController.logout);

router.post('/add-game/:rpg', mainController.addGame);
router.post('/login', authController.login);


module.exports = router;