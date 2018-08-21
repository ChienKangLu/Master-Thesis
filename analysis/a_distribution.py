from pymongo import MongoClient
import matplotlib.pyplot as plt
import math
import numpy as np


client = MongoClient('localhost', 27017)
dbName = "finaldata"
db = client[dbName]

coll = ["POI_all"]
attr=["rating"]

choose_coll = coll[0]
choose_attr = attr[0]
print(choose_coll)
print(choose_attr)

cursor = db[choose_coll].find({})
bucket = [0,0,0,0,0]  # 0 0.1-1 , 1.1-2 , 2.1-3 , 3.1-4 , 4.1-5

for doc in cursor:
    rating = doc["rating"]
    if rating is None:
        rating = 0
    if rating ==0:
        bucket[0]+=1
    else:
        idx = math.ceil(rating)
        bucket[int(idx-1)] += 1

print(bucket)


n_groups = 5

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
# plt.xlabel('attraction')
# plt.ylabel('number')
plt.xticks(index, ('0~1', '1.1~2', '2.1~3', '3.1~4','4.1~5'))

plt.tight_layout()
plt.show()