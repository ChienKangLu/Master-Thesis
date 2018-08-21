from bson import ObjectId
from pymongo import MongoClient
import random
# 建立finaldata_except，例外值模擬

client = MongoClient('localhost', 27017)
db_original = client["finaldata"]

pair_cursor = db_original["yilanpairwise_all"].find({})

poi_cursor = db_original["POI_all"].find()

db = client["finaldata_except"]

# 把POI_all和yilanpairwise_all全部copy到finaldata_except
if False:
    for doc in poi_cursor:
        print(doc)
        db["POI_all"].insert_one(doc)

if False:
    for doc in pair_cursor:
        print(doc)
        db["yilanpairwise_all"].insert_one(doc)

if True:
    except_value = 6
    random.seed(2000)
    '''
    # 左上 24.746379560784863 121.75150181745687
    # 右下 24.676829775446404 121.79647709821859
        chapter6_2_1
        a4+d5+prune+h(8am,8pm)
        
        chapter7
        a4+d5+e3+prune+h(8am,8pm)
        
        0
        5
    '''

    '''
    # 左上 24.764207010566853,121.7131757463028
    # 右下 24.734119438707612,121.76089760909576
        chapter6_2_1
        a4+d5+prune+h(8am,8pm)

        chapter7
        a4+d5+e3+prune+h(8am,8pm)

        23
        5
    '''

    '''
    # 左上 24.68070253732153,121.74014939731319
    # 右下 24.654807183468716,121.81087388461788
    
        chapter6_2_1
        a4+d5+prune+h(8am,8pm)

        chapter7
        a4+d5+e3+prune+h(8am,8pm)

        49
        5
    '''

    ltop = {"lat":24.764207010566853,"lng":121.7131757463028}
    rbottom = {"lat":24.734119438707612,"lng":121.76089760909576}
    print("ltop:",ltop)
    print("rbottom:",rbottom)
    poi_id = []
    for doc in poi_cursor:
        # print(doc)
        id = doc["_id"]
        if rbottom["lat"] <= doc["lat"] <= ltop["lat"] and \
                                ltop["lng"] <= doc["lng"] <= rbottom["lng"]:
            poi_id.append(id)
            print(doc)

    print("poi_id size:",len(poi_id))
    print(poi_id)
    '''
    {
        $and:[
            {
                from:{
                    $in:[ObjectId("59e5a852d63dcb19ac9845ea"),ObjectId('59e5a89bd63dcb19ac984cfd')]
                }
            },
            {
                to:{
                    $in:[ObjectId("59e5a852d63dcb19ac9845ea"),ObjectId('59e5a89bd63dcb19ac984cfd')]
                }
            }
        ]
    }
    '''
    query ={
        "$and":[
            {
                "from":{
                    "$in":poi_id
                }
            },
            {
                "to":{
                    "$in":poi_id
                }
            }
        ]
    }

    db["yilanpairwise_all"].update_many({},{"$set":{"except":0}})
    db["yilanpairwise_all"].update_many(query,{"$set":{"except": except_value}})

