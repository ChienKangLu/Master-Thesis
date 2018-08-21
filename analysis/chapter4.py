from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client["chapter4"]

coll = ["a+prune(8am,8pm)","a(11am,11pm)","a+prune(11am,11pm)"]
attr=["nodeNum","excutionTime","internalAttraction","totalDistance","totalTravelTime"]

choose_coll = coll[1]
choose_attr = attr[0]
print(choose_coll)
print(choose_attr)

cursor = db[choose_coll].aggregate(
    [
        {"$group":
            {
                "_id": "$depth",
                choose_attr: {"$avg": "$Result."+choose_attr},
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]
)

for doc in cursor:
    print("{0} , {1:.3f} , {2}".format(doc["_id"],doc[choose_attr],doc["count"]))
