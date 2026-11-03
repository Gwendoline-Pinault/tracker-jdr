const { Router } = require('express');
const mainController = require('./controllers/mainController');
const router = Router();

router.get('/', mainController.home);
router.get('/campagne/:rpg', mainController.rpgPage);
router.get('/campagne/:rpg/details/:character', mainController.characterPage);

// modifications routes
router.get('/nouvelle-campagne', mainController.newCampaignPage);
router.get('/campagne/:rpg/nouvelle-partie', mainController.newGamePage);
router.get('/campagne/:rpg/nouveau-personnage', mainController.newCharacterPage);

router.post('/add-game/:rpg', mainController.addGame);
router.post('/nouvelle-campagne', mainController.addNewRpg);
router.post('/nouveau-personnage', mainController.addNewCharacter);

module.exports = router;