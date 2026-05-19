from matplotlib import pyplot
import os
from matplotlib import ticker as loc

path = os.path.abspath(__file__)
imgPath = path.replace("scripts\\functions\\histogram.py", "public\\images\\histograms\\")


def makeHistogram(dicesList: list, character: str, nb: int):
    pyplot.hist(dicesList, nb, (1, nb), density=False)
    pyplot.plot([0,nb], [len(dicesList)/nb, len(dicesList)/nb], color='red')
    pyplot.xticks(range(0, nb +1, 5))
    pyplot.xlabel('valeur du dé')
    pyplot.ylabel('occurences')
    pyplot.title(character)
    pyplot.grid(True, axis='y')
    pyplot.savefig(f"{imgPath}\\hist-{character}.png")
    pyplot.clf()


def count(dicesList, ref):
    count = 0

    for dice in dicesList:
        if dice == ref:
            count = count+1
    
    return count
