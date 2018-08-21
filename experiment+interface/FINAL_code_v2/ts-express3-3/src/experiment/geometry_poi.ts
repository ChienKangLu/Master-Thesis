import {DBAsync} from '../database/DBAsync';
//參考 https://itbilu.com/database/mongo/V1SnscdkZ.html#location-index-create
//建置地裡索引格式的資料庫
//參考 http://www.mongoing.com/mongodb-geo-index-1/

//[step 1] 取出資料庫內全部的POI
async function data(){
    let db=await DBAsync.connectDBAsync("finaldata");//poitest/finaldata
    let coll=await DBAsync.coll(db,"POI_all");//poi/POI_all
    let pois=await DBAsync.find(coll, {}, {});
    await DBAsync.closeDB();
    return pois;
}
//[step 2] 存入DB
async function save_testDataNames(DBname:string,newDatas:Array<any>,collname:string){
    let db=await DBAsync.connectDBAsync(DBname);
    let coll=await DBAsync.coll(db,collname);
    await DBAsync.insertMany(coll,newDatas);
    await DBAsync.closeDB();
}

async function run(){
    let pois=await data();
    let new_pois = [];
    for (let poi of pois) {
        console.log(poi.name,poi.lat,poi.lng,poi._id);
        new_pois.push({
            "_id" : poi._id,
            "name" :  poi.name,
            "placeID" : poi.placeID,
            "city" : poi.city,
            "address" : poi.address,
            "loc":{
                "lng" : poi.lng,
                "lat" : poi.lat
            },            
            "stay_time" : poi.stay_time,
            "open_time" : poi.open_time,
            "introduction" : poi.introduction,
            "rating" : poi.rating,
            "class" : poi.class,
            "price" : poi.price,
            "value" : poi.value,
            "tag" : poi.tag,
            "autotag" :  poi.autotag,
            "type" : poi.type
        });
    }
    await save_testDataNames("explore",new_pois,"geometry_poi");
}
run();