require('dotenv').config();
const dataMapper = require('../models/datamapper');
const authController = require('./authController');

const mainController = {
  home: (req, res) => {
    const rpgFilesList = dataMapper.rpgFilesList();

    res.render('index.ejs', { rpgFilesList });
  },
  rpgPage: async (req, res) => {
    const rpgSlug = req.params.rpg;
    const rpgData = dataMapper.getRpgData(rpgSlug);
    const rpgList = dataMapper.rpgList();

    // ordonne les parties par date décroissante (de la plus récente à la plus ancienne)
    const orderedGamesList = dataMapper.orderedGamesList(rpgData);

    const orderedData = {
      ...rpgData,
      games: orderedGamesList
    }

    res.render('rpgPage.ejs', { rpgData: orderedData, rpgList });
  },
  characterPage: async (req, res) => {
    const rpgSlug = req.params.rpg;
    const character = req.params.character;
    const rpgData = dataMapper.getRpgData(rpgSlug);
    const rpgList = dataMapper.rpgList();
    const dicesList = rpgData.stats[character].dicesList.toSorted((a, b) => a - b);
    const counts = {};
    
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

    res.render('characterPage.ejs', { rpgData, character, rpgList, dicesList, counts, min, max });
  },
  newGamePage: (req, res) => {
    const rpg = req.params.rpg;
    const rpgData = dataMapper.getRpgData(rpg);
    const characters = rpgData.characters;
    const rpgList = dataMapper.rpgList();

    res.render('newGamePage.ejs', { rpg, characters, rpgData, rpgList });
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
        average: null,
        median: null,
        success: 0,
        fail: 0
      }
    });

    // génère les stats pour chaque personnage
    characters.forEach(character => {
      if (form[character]) {
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
      } else {
        // si le joueur n'a pas lancé de dés, ne rien faire (garde la valeur initiale)
      }
    });

    // ajoute la partie au fichier de sauvegarde
    const gameFile = rpgData;
    gameFile.games[date] = game;

    // met à jour les statistiques globales
    characters.forEach(character => {
      
      // si le joueur a lancé les dés, on calcule les stats
      if (game[character].dices.length > 0) {
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
      } else {
        // on garde les stats par défaut (initialisation)
      }
    })

    if (form.status === true) {
      gameFile.status = "Terminée";
    }

    dataMapper.updateGameFile(gameFile, rpg);
    dataMapper.updateHistograms();

    res.redirect(`/campagne/${rpg}`);
  },
  newCampaignPage: (req, res) => {
    res.render('newCampaignPage');
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
  },
  newCharacterPage: async (req, res) => {
    const rpg = req.params.rpg;
    
    const campaign = dataMapper.getRpgData(rpg).name;
    
    res.render('newCharacterPage', { rpg, campaign });
  },
  addNewCharacter: async (req, res) => {
    const { character, campaign } = await req.body;

    // récupère les données du fichier de sauvegarde
    const rpgData = dataMapper.getRpgData(campaign);
    const newRpgData = rpgData;

    // ajoute le nouveau personnage à la liste et réordonne
    newRpgData.characters.push(character);
    newRpgData.characters.sort();

    // initialize les données globales du personnage pour les parties à venir
    newRpgData.stats[character] = {
      globalMedian: 0,
      globalAvg: 0,
      globalSuccess: 0,
      globalFail: 0,
      dicesList: []
    };

    // met à jour le tableau global des stats par ordre alphabétique
    const orderedStats = {};

    newRpgData.characters.map((pj) => {
      orderedStats[pj] = newRpgData.stats[pj];
    });

    newRpgData.stats = orderedStats;

    // met à jour le fichier de sauvegarde avec les nouvelles données
    dataMapper.updateGameFile(newRpgData, campaign);

    res.redirect(`/campagne/${campaign}`);
  }
}

module.exports = mainController;