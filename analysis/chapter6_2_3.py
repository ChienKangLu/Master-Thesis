from pymongo import MongoClient
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
# all use (TPBH)
def draw(db, coll, ax, color, marker,center):
    X = []
    Y = []
    Z = []
    cursor = db[coll].find(
        {"depth": 7},
        {
            "Result.totalDistance": 1,
            "Result.internalAttraction": 1,
            "Result.totalTravelTime": 1
        }
    )
    if not center:
        for doc in cursor:
            X.append(doc["Result"]["internalAttraction"])
            Y.append(doc["Result"]["totalDistance"])
            Z.append(doc["Result"]["totalTravelTime"])
    else:
        sumX = 0
        sumY = 0
        sumZ = 0
        num = 0
        for doc in cursor:
            num += 1
            sumX += doc["Result"]["internalAttraction"]
            sumY += doc["Result"]["totalDistance"]
            sumZ += doc["Result"]["totalTravelTime"]
        X.append(sumX / num)
        Y.append(sumY / num)
        Z.append(sumZ / num)
    ax.scatter(X, Y,Z, color=color, marker=marker, alpha=0.5, linestyle='None', picker=True,s=40)


client = MongoClient('localhost', 27017)
db = client["chapter6_2_3"]
coll = ["a4+d20+t0.5+prune+h(8am,8pm)"]
db1 = client["chapter6_2_1"]
coll1 = ["d+prune+h(8am,8pm)","a4+d5+prune+h(8am,8pm)","a4+d10+prune+h(8am,8pm)","a4+d20+prune+h(8am,8pm)",
                 "a3.5+d20+prune+h(8am,8pm)","a4.5+d20+prune+h(8am,8pm)"]
db2 = client["chapter5"]
coll2 = ["a+prune+h(8am,8pm)"]

fig = plt.figure()
ax = Axes3D(fig)
center = False
legend=[]

draw(db2,coll2[0],ax,"black","x",center)
draw(db1,coll1[0],ax,"black",'+',center)
draw(db1,coll1[3],ax,"green",'D',center)
draw(db,coll[0],ax,"red","o",center)
legend.append("a")
legend.append("d")
legend.append("a4+d20")
legend.append("a4+d20+t0.5")

ax.set_xlabel("attraction")
ax.set_ylabel("distance")
ax.set_zlabel("travelTime")
plt.legend(legend, loc='upper left')
plt.show()



