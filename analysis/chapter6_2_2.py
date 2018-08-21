import numpy as np
import matplotlib.pyplot as plt
from pymongo import MongoClient
from myDocx import myDocx


def array(cursor):
    data = []
    for doc in cursor:
        data.append(doc["attr"])
    return data


def query(db,choose_coll,choose_attr,decimal_gate):
    if decimal_gate is True:
        cursor = db[choose_coll].aggregate(
            [
                {"$match": {"Result.type": "good"}},
                {"$group":
                    {
                        "_id": "$depth",
                        "attr": {"$avg": "$Result."+choose_attr},
                        "count": {"$sum": 1}
                    }
                },
                {"$sort": {"_id": 1}}
            ]
        )
        data= ['%.2f' % elem for elem in array(cursor)]
    else:
        cursor = db[choose_coll].aggregate(
            [
                {"$match": {"Result.type": "good"}},
                {"$group":
                    {
                        "_id": "$depth",
                        # "attr": {"$avg": "$Result."+choose_attr},
                        "attr": {"$avg": "$" + choose_attr},
                        "count": {"$sum": 1}
                    }
                },
                {"$sort": {"_id": 1}}
            ]
        )
        data = array(cursor)
    return data


def add0(data,zero_count):
    for i in range(0,zero_count):
        data.append(0)
    return data


def dissatisfaction(set_attr):
    client = MongoClient('localhost', 27017)
    db1 = client["chapter6_2_1"]
    coll1 = ["d+prune+h(8am,8pm)","a4+d5+prune+h(8am,8pm)","a4+d10+prune+h(8am,8pm)","a4+d20+prune+h(8am,8pm)", "a3.5+d20+prune+h(8am,8pm)", "a4.5+d20+prune+h(8am,8pm)"]
    db2 = client["chapter5"]
    coll2 = ["a+prune+h(8am,8pm)"]
    db3 = client["chapter6_2_2_Limit5mins"]
    coll3= ["","a4+d5(8am,8pm)", "a4+d10(8am,8pm)", "a4+d20(8am,8pm)", "a3.5+d20(8am,8pm)", "a4.5+d20(8am,8pm)"]
    attrs=["","a4d5","a4d10","a4d20","a3.5d20","a4.5d20"]
    titles = ["a4+d5","a4+d10","a4+d20","a3.5+d20","a4.5+d20"]

    ########## adjust here ############
    attr = set_attr  # 1 2 3 4 5
    ########## adjust here ############
    n_groups =6
    title = titles[attr-1]
    a_d = query(db1,coll1[attr],attrs[attr],False)
    # if attr>=4:
    #     buf=3
    # else:
    #     buf=2
    # a_d_opt = add0(query(db3,coll3[attr],attrs[attr]),buf)
    a_d_opt = query(db3,coll3[attr],attrs[attr],False)
    a = query(db2,coll2[0],attrs[attr],False)
    d = query(db1,coll1[0],attrs[attr],False)
    # create plot
    fig, ax = plt.subplots()
    index = np.arange(n_groups)
    bar_width = 0.2
    opacity = 0.8
    rects4 = plt.bar(index, a_d_opt , bar_width,
                     alpha=opacity,
                     color='y',
                     label='a+d(BF)') #a+d(opt)
    rects1 = plt.bar(index+ bar_width, a_d, bar_width,
                     alpha=opacity,
                     color='r',
                     label='a+d(TPBH)') #a+d

    rects2 = plt.bar(index + 2*bar_width, a , bar_width,
                     alpha=opacity,
                     color='g',
                     label='a(TPBH)')

    rects3 = plt.bar(index + 3*bar_width, d , bar_width,
                     alpha=opacity,
                     color='b',
                     label='d(TPBH)')



    plt.xlabel('depth')
    plt.ylabel('value')
    # plt.title(title)
    print(title)
    plt.xticks(index + bar_width, ('2', '3', '4','5','6','7'))
    plt.legend()

    plt.tight_layout()
    plt.show()


def querycount(db,choose_coll):
    cursor = db[choose_coll].aggregate(
        [
            {"$match": {"Result.type": "good"}},
            {"$group":
                {
                    "_id": "$depth",
                    "attr": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]
    )
    return array(cursor)


def statistic(attrName):
    datas=[]
    client = MongoClient('localhost', 27017)
    db1 = client["chapter6_2_1"]
    coll1 = ["d+prune+h(8am,8pm)","a4+d5+prune+h(8am,8pm)","a4+d10+prune+h(8am,8pm)","a4+d20+prune+h(8am,8pm)", "a3.5+d20+prune+h(8am,8pm)", "a4.5+d20+prune+h(8am,8pm)"]
    db2 = client["chapter5"]
    coll2 = ["a+prune+h(8am,8pm)"]
    db3 = client["chapter6_2_2_Limit5mins"]
    coll3= ["","a4+d5(8am,8pm)", "a4+d10(8am,8pm)", "a4+d20(8am,8pm)", "a3.5+d20(8am,8pm)", "a4.5+d20(8am,8pm)"]


    if attrName is None:
        print("good count")
    else:
        print(attrName)

    print("---------------------------------------")

    for i in range(1,6):
        if attrName is None:
            data1 = querycount(db3,coll3[i])
            print(coll3[i],data1)
            data2 = querycount(db1,coll1[i])
            print(coll1[i],data2)
            print("---------------------------------------")
        else:
            data1 = query(db3,coll3[i],attrName,True)
            print(coll3[i],data1)
            data2 = query(db1,coll1[i],attrName,True)
            print(coll1[i],data2)
            print("---------------------------------------")
        datas.append(data1)
        datas.append(data2)
    return datas

gate = True
if gate:
    set_attr = 5 # 1 2 3 4 5
    dissatisfaction(set_attr)

gate = False
if gate :
    attr = ["nodeNum", "excutionTime", "internalAttraction", "totalDistance", "totalTravelTime"]
    sele_attr = attr[3]
    # sele_attr = None
    datas=statistic(sele_attr)
    print(datas)

    # create word docx table
    collName = ["喜好滿意","距離滿意","方法","2","3","4","5","6","7"]
    setting = [{"a":4,"d":5},{"a":4,"d":10},{"a":4,"d":20},{"a":3.5,"d":20},{"a":4.5,"d":20}]
    method =["BF","TPBH"]
    collNum = 9  # 0~8
    rowNum =12 # 0~11
    mydocx = myDocx(datas,collName,setting,method,collNum,rowNum)
    if sele_attr is None:
        sele_attr = "count"
    mydocx.createDocx("docxTable/"+sele_attr+".docx")
