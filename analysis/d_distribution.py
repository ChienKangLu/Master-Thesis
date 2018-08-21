from pymongo import MongoClient
import matplotlib.pyplot as plt
import math
import numpy as np


client = MongoClient('localhost', 27017)
dbName = "finaldata"
db = client[dbName]

coll = ["yilanpairwise_all"]
attr=["distance"]

choose_coll = coll[0]
choose_attr = attr[0]
print(choose_coll)
print(choose_attr)

cursor = db[choose_coll].find({})
bucket = [0,0,0,0,0,0,0,0,0,0]  # 0 0.1-10 , 10.1-20 , 20.1-30 , 30.1-40 , 40.1-50

for doc in cursor:
    rating = doc["distance"]
    if rating is None:
        rating = doc["lineDistance"]
    # if rating ==0:
    #     bucket[0]+=1
    idx = math.ceil(rating)
    print(rating)
    bucket[int((idx-1)/10)] += 1

print(bucket)


n_groups = 10

# create plot
fig, ax = plt.subplots()
index = np.arange(n_groups)
print(index)
bar_width = 0.4
opacity = 0.8
rects = plt.bar(index, bucket, bar_width,
                 alpha=opacity,
                 color='w',
                 edgecolor='k',
                 label='Frank')
# plt.xlabel('熱門度')
# plt.ylabel('數量')
plt.xticks(index, ('0~10', '10.1~20', '20.1~30', '30.1~40','40.1~50','50.1~60','60.1~70','70.1~80','80.1~90','90.1~100'))

plt.tight_layout()
plt.show()