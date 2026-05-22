require('dotenv').config();
const dataMapper = require('../models/datamapper');
const authController = require('./authController');

const mainController = {
  home: (req, res) => {
    const rpgFilesList = dataMapper.rpgFilesList();
    const username = req.session.username;

    res.render('index.ejs', { rpgFilesList, username });
  },
  rpgPage: async (req, res) => {
    const rpgSlug = req.params.rpg;
    const rpgData = dataMapper.getRpgData(rpgSlug);
    const rpgList = dataMapper.rpgList();
    const username = await req.session.username;

    // ordonne les parties par date décroissante (de la plus récente à la plus ancienne)
    const orderedGamesList = dataMapper.orderedGamesList(rpgData);

    const orderedData = {
      ...rpgData,
      games: orderedGamesList
    }

    res.render('rpgPage.ejs', { rpgData: orderedData, rpgList, username });
  },
  characterPage: async (req, res) => {
    const rpgSlug = req.params.rpg;
    const character = req.params.character;
    const rpgData = dataMapper.getRpgData(rpgSlug);
    const rpgList = dataMapper.rpgList();
    const dicesList = rpgData.stats[character].dicesList.toSorted((a, b) => a - b);
    const counts = {};
    const username = await req.session.username;
    
    for (const dice of dicesList) {
      counts[dice] = counts[dice] ? counts[dice] + 1 : 1;
    }

    for (i = 1; i <= rpgData.diceSystem; i++) {
      if (!counts[i]) {
        counts[i] = 0;
      }
    }
    
    const max = Math.max(...Object.values(counts));
    const min = Math.min(...Object.values(counts));

    res.render('characterPage.ejs', { rpgData, character, rpgList, dicesList, counts, min, max, username });
  },
  newGamePage: (req, res) => {
    const rpg = req.params.rpg;
    const rpgData = dataMapper.getRpgData(rpg);
    const characters = rpgData.characters;
    const rpgList = dataMapper.rpgList();
    const username = req.session.username;

    res.render('newGamePage.ejs', { rpg, characters, rpgData, rpgList, username });
  },
  addGame: async (req, res) => {
    const form = await req.body;
    const rpg = req.params.rpg;

    // format date
    const year = form.date.split("-")[0];
    const month = form.date.split("-")[1];
    const day = form.date.split("-")[2];
    const date = `${day}/${month}/${year}`;

    // get rpg character list
    const rpgData = dataMapper.getRpgData(rpg);
    const characters = rpgData.characters;

    // initialisation de l'objet "game"
    const game = {};

    characters.forEach(character => {
      game[character] = {
        dices: [],
        average: 0,
        median: 0,
        success: 0,
        fail: 0
      }
    });

    // génère les stats pour chaque personnage
    characters.forEach(character => {
      // récupère la liste des dés et la formate
      const dices = dataMapper.formatDices(form[character]);
      game[character].dices = dices;

      // calcule de la moyenne
      const average = dataMapper.calculateAverage(dices);
      game[character].average = average; 

      // calcule de la médiane
      const median = dataMapper.calculateMedian(dices);
      game[character].median = median;

      // calcule le nombre de réussites et d'échecs critiques
      const {success, fail} = dataMapper.getCritValues(dices, rpgData.diceSystem, rpgData.systemOrder);
      game[character].success = success;
      game[character].fail = fail;

    });

    // ajoute la partie au fichier de sauvegarde
    const gameFile = rpgData;
    gameFile.games[date] = game;

    // met à jour les statistiques globales
    characters.forEach(character => {
      // met à jour la liste des dés
      const dicesList = [...gameFile.stats[character].dicesList];
      dicesList.push(...gameFile.games[date][character].dices);

      const sortedDices = dicesList.toSorted((a,b) => a - b);
      
      // calcule les stats globales
      const globalMedian = dataMapper.calculateMedian(dicesList);
      const globalAvg = dataMapper.calculateAverage(dicesList);
      const {success, fail} = dataMapper.getCritValues(dicesList, rpgData.diceSystem, rpgData.systemOrder);
      
      // met à jour le fichier final
      gameFile.stats[character].globalAvg = globalAvg;
      gameFile.stats[character].globalMedian = globalMedian;
      gameFile.stats[character].globalSuccess = success;
      gameFile.stats[character].globalFail = fail;
      gameFile.stats[character].dicesList = sortedDices;
    })

    if (form.status === true) {
      gameFile.status = "Terminée";
    }

    dataMapper.updateGameFile(gameFile, rpg);
    dataMapper.updateHistograms();

    res.redirect(`/campagne/${rpg}`);
  },
  newCampaignPage: async (req, res) => {
    const username = await req.session.username;

    if (username === process.env.IDENTIFIANT) {
      res.render('newCampaignPage', { username });

    } else {
      res.redirect('/');
    }
  },
  addNewRpg: async (req, res) => {
    const form = await req.body;
    const charactersArray = form.characters.split(", ");

    // new campaign file
    let campaignData = {...form, 
      diceSystem: parseInt(form.diceSystem, 10), 
      characters: charactersArray,
      status: "En cours",
      stats: {},
      games: {}
    };

    charactersArray.map(character => {
      campaignData.stats[character] = {
        globalMedian: 0,
        globalAvg: 0,
        globalSuccess: 0,
        globalFail: 0,
        dicesList: []
      };
    });

    dataMapper.createGameFile(campaignData, form.slug);

    res.redirect('/');
  }
}

module.exports = mainController;