const fs = require('fs');
const path = require('path');

const dataMapper = {
  rpgFilesList: () => {
    const rpgList = fs.readdirSync('data/rpgData/');
    const rpgFilesList = [];
    
    rpgList.forEach((file) => {
      const filePath = path.resolve(`data/rpgData/${file}`);
      const rpgFile = require(`${filePath}`);
      rpgFilesList.push(rpgFile);
    })
    
    return rpgFilesList;
  },
  rpgList: () => {
    const rpgFilesList = dataMapper.rpgFilesList();
    const rpgList = [];

    rpgFilesList.forEach((file) => {
      rpgList.push({
        name: file.name,
        slug: file.slug
      });
    });

    return rpgList;
  },
  getRpgData: (rpgSlug) => {
    const filePath = path.resolve(`data/rpgData/${rpgSlug}.json`);
    const rpgFile = require(`${filePath}`);

    return rpgFile;
  },
  orderedGamesList: (rpgData) => {
    const gamesList = rpgData.games;
    const newList = {};
    const orderDates = []; 

    // crée un tableau des dates pour les trier par ordre inverse
    Object.keys(gamesList).map((date) => {
      orderDates.unshift(date);
    });
    
    // crée le nouvel objet avec les dates inversées
    orderDates.forEach(date => {
      newList[date] = gamesList[date];
    });

    return newList;
  },
  formatDices: (dicesArr) => {
    const dicesStr = dicesArr.trim().split(",");
    const dices = [];

    dicesStr.map((str) => {
      const dice = parseInt(str, 10);
      dices.push(dice);
    });

    return dices;
  },
  calculateAverage: (array) => {
    let sum = 0;

    const average = Math.round(array.reduce((acc, curr) => acc + curr, sum) / array.length);

    return average;
  },
  calculateMedian: (array) => {
    const sortedDices = array.toSorted((a,b) => a - b);

    const median = sortedDices[Math.floor((sortedDices.length -1) / 2)];

    return median;
  },
  /**
   * 
   * @param {array} dices tableau de la liste des dés
   * @param {number} diceSystem valeur du dé du sytème de jeu
   * @returns {object} {success: number, fail: number} renvoie le total pour chaque type de critique
   */
  getCritValues: (dices, diceSystem, systemOrder) => {
    let fail = 0;
    let success = 0;

    if (!diceSystem || !dices || !systemOrder) {
      return {error: "getCritValues : Données manquantes. Vérifier les paramètres"};
    }

    if (diceSystem === 20) {
      dices.forEach((dice) => {
        if (dice === 1) {
          if (systemOrder === 'DESC') fail++;
          if (systemOrder === 'ASC') success++;
        } else if (dice === 20) {
          if (systemOrder === 'DESC') success++;
          if (systemOrder === 'ASC') fail++; 
        }
      });
    } else if (diceSystem === 100) {
      if (systemOrder === 'ASC') {
        dices.forEach((dice) => {
          if (dice <= 5) {
            success++;
          } else if (dice >= 96) {
            fail++;
          }
        })
      }
    }

    return {fail, success};
  },
  updateGameFile: (gameFile, rpg) => {
    fs.writeFileSync(`data/rpgData/${rpg}.json`, JSON.stringify(gameFile, null, 2));
    
    console.info('Save updated.');
    
  }

}

module.exports = dataMapper;