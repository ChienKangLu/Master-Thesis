from pymongo import MongoClient
import matplotlib.pyplot as plt

# all use (TPBH)
def draw(coll, color, db, type, marker, center):
    X = []
    Y = []
    choose_coll = coll
    cursor = db[choose_coll].find({"Result.type": "good", "depth": 7},
                                  {"Result.totalDistance": 1, "Result.internalAttraction": 1,
                                   "Result.totalTravelTime": 1, "depth": 1, "value": 1})
    if not center:
        for doc in cursor:
            if type == "distance":
                Y.append(doc["Result"]["totalDistance"])
            elif type == "travelTime":
                Y.append(doc["Result"]["totalTravelTime"])
            elif type == "value":
                Y.append(doc["value"])
            X.append(doc["Result"]["internalAttraction"])
    else:
        sumX = 0
        sumY = 0
        num = 0
        for doc in cursor:
            num+=1
            if type == "distance":
                sumY += doc["Result"]["totalDistance"]
            elif type == "travelTime":
                sumY += doc["Result"]["totalTravelTime"]
            elif type == "value":
                sumY += doc["value"]
            sumX += doc["Result"]["internalAttraction"]
        X.append(sumX / num)
        Y.append(sumY / num)
    plt.scatter(X, Y, color=color, marker=marker, alpha=0.5, linestyle='None', picker=True)
    return coll


def onpick(event):
    ind = event.ind
    print('onpick3 scatter:', ind)


if __name__ == '__main__':
    client = MongoClient('localhost', 27017)
    db1 = client["chapter6_2_1"]
    coll1 = ["d+prune+h(8am,8pm)","a4+d5+prune+h(8am,8pm)","a4+d10+prune+h(8am,8pm)","a4+d20+prune+h(8am,8pm)",
                 "a3.5+d20+prune+h(8am,8pm)","a4.5+d20+prune+h(8am,8pm)"]
    db2 = client["chapter5"]
    coll2 = ["a+prune+h(8am,8pm)"]

    attr = ["nodeNum", "excutionTime", "internalAttraction", "totalDistance"]

    fig = plt.figure();
    fig.canvas.mpl_connect('pick_event', onpick)

    type = "distance"
    center = True
    legend=[]

    #  a and d
    draw(coll2[0], "black", db2, type, '+', center)
    draw(coll1[0], "black", db1, type, 'x',center)
    legend.append("a")
    legend.append("d")

    #  tuning distance
    # draw(coll1[1], "purple", db1, type, '*', center)
    # draw(coll1[2], "brown", db1, type, "v", center)
    # draw(coll1[3], "red", db1, type, 'D', center)
    # legend.append("a4+d5")
    # legend.append("a4+d10")
    # legend.append("a4+d20")

    #  tuning attraction
    draw(coll1[4], "purple", db1, type, '*',center)
    draw(coll1[3], "brown", db1,  type, "v",center)
    draw(coll1[5], "red", db1, type, 'D',center)
    legend.append("a3.5+d20")
    legend.append("a4+d20")
    legend.append("a4.5+d20")

    plt.xlim([-1.488181280892302,31.191487895096255])
    plt.ylim([-7.548115237387423,172.55587423562324])
    plt.xlabel("attraction")
    plt.ylabel(type)

    plt.legend(legend)
    plt.show()