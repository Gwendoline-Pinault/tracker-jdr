import os
from os import listdir
import json
import numpy
from functions.histogram import makeHistogram, count

path = os.path.abspath(__file__)
jsonPath = path.replace("scripts\\makeHist.py", "data\\rpgData\\")
rpgFiles = os.listdir(jsonPath)

for rpg in rpgFiles:
    rpgPath = jsonPath + rpg
    with open(rpgPath, 'r', encoding='utf-8') as rpgFile:
        rpgData = json.load(rpgFile)

    for character in rpgData["characters"] :
        makeHistogram(rpgData["stats"][character]["dicesList"], character, rpgData["diceSystem"])

    rpgFile.close()



# ---- code pour un seul fichier ----

# rpgPath = jsonPath + 'pathfinder.json'
# with open(rpgPath, 'r', encoding='utf-8') as rpgFile:
#     rpgData = json.load(rpgFile)

# makeHistogram(rpgData["stats"]["Elora"]["dicesList"], "Elora", 20)