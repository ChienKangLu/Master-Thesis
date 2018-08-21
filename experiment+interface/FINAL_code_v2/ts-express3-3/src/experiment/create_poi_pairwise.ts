import Vector from '../algorithm/Vector';
import Node from '../algorithm/Node';
import POI from '../algorithm/POI';
import POImap from '../algorithm/POImap';
import PriorityQueue from '../algorithm/PriorityQueue';
import Astar from '../algorithm/Astar';
import Time from '../algorithm/Time';
import vzTaiwan from '../preprocess/vzTaiwan';
import { Result, detail, weekTime, dayTime, timeStatus, timeString, request, constraint,experiment,expSetting,random_pair,testDataNames, Path} from '../algorithm/record';
import Tool from '../algorithm/Tool';
import {DBAsync} from '../database/DBAsync';
import { ObjectID } from 'mongodb';


let start_time: Time = new Time(undefined, 2017, 10, 30, 8, 0, 0);

function createPOI(name:string,city:string,address:string,lat:number,lng:number,stay_time:number,weekday_text:Array<string>|null,introduction:string,rating:number){
    let data:any={
        "name" : name,
        "city" : city,
        "address" : address,
        "lat" : lat,
        "lng" : lng,
        "stay_time" : stay_time,
        "open_time" : {
            "open_now" : true,
            "weekday_text" : weekday_text
        },
        "introduction" : introduction,
        "rating" : rating
    }
    return data;
}
async function save_datas(DBname:string,collName:string,datas:Array<any>){
    let db=await DBAsync.connectDBAsync(DBname);
    let coll=await DBAsync.coll(db,collName);
    await DBAsync.insertMany(coll,datas);
    await DBAsync.closeDB();
}
async function data(start_time:Time) {
    let db=await DBAsync.connectDBAsync("dating");
            let coll=await DBAsync.coll(db,"POI_all");
            let pois=await DBAsync.find(coll, {}, {});
            let poi_num: number = 0;
            for (let poi of pois) {
                let weekTime: weekTime = vzTaiwan.weekday_textParsing(poi.open_time);
                let now: POI = new POI(poi.name, poi.rating, poi._id.toString()/*, 0*/, poi.lat, poi.lng, poi.stay_time, weekTime);
                POImap.insertPoi(now);
                poi_num++;
            }
    POImap.set_realTimes(start_time);
    Tool.actionmsg('get POIs from mongodb over');
    Tool.datanmsg(`number of poi:${poi_num}`);
    await DBAsync.closeDB();
}
function getDistance(lat1:number, lng1:number, lat2:number, lng2:number):number { //公尺
    var dis:number = 0;
    var radLat1:number = toRadians(lat1);
    var radLat2:number = toRadians(lat2);
    var deltaLat:number = radLat1 - radLat2;
    var deltaLng:number = toRadians(lng1) - toRadians(lng2);
    var dis:number = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;
}
function toRadians(d:number):number {  return d * Math.PI / 180;}
async function createPairWise(speed:number,real_rate:number){
    let datas:Array<any> = [];
    for(let from of POImap.pois){
        for(let to of POImap.pois){
            let from_objectId = new ObjectID(from._id);
            let to_objectId = new ObjectID(to._id);
            let distance = (getDistance(from.lat,from.lng,to.lat,to.lng) * real_rate)/ 1000;
            let travelTime = distance/speed;
            let data ={
                "from" : from_objectId,
                "to" : to_objectId,
                "distance" : distance,
                "travelTime" : travelTime
            }
            datas.push(data);
        }
    }
    await save_datas("dating","pairwise_all",datas);
}

async function run(){
    let poi1=createPOI("海灣星空咖啡館",
                        "桃園縣",
                        "桃園縣蘆竹鄉山腳村7鄰山腳81-6號",
                        25.102361,
                        121.291342,
                        1,
                        [ 
                            "Monday: 3:00 PM – 1:00 AM", 
                            "Tuesday: 3:00 PM – 1:00 AM", 
                            "Wednesday: 3:00 PM – 1:00 AM", 
                            "Thursday: 3:00 PM – 1:00 AM", 
                            "Friday: 3:00 PM – 1:00 AM", 
                            "Saturday: 11:00 – 1:00 AM", 
                            "Sunday: 11:00 – 1:00 PM"
                        ],
                        "",5);
    let poi2=createPOI("覓燒肉",
                        "桃園市",
                        "桃園市桃園區莊敬路一段313號",
                        25.025452,
                        121.300420,
                        1,
                        [ 
                            "Monday: Closed", 
                            "Tuesday: 5:00 PM – 00:00 AM", 
                            "Wednesday: 5:00 PM – 00:00 AM", 
                            "Thursday: 5:00 PM – 00:00 AM", 
                            "Friday: 5:00 PM – 00:00 AM", 
                            "Saturday: 12:00 – 3:00 PM, 5:00 PM – 00:00 AM", 
                            "Sunday: 12:00 – 3:00 PM, 5:00 PM – 00:00 AM"
                        ],
                        "",5);
    let poi3=createPOI("齋明寺賞櫻",
                        "桃園市",
                        "桃園市大溪區齋明街153號",
                        24.889176, 
                        121.274029,
                        1,
                        [ 
                            "Monday: 9:00 AM – 5:00 PM", 
                            "Tuesday: 9:00 AM – 5:00 PM", 
                            "Wednesday: 9:00 AM – 5:00 PM", 
                            "Thursday: 9:00 AM – 5:00 PM", 
                            "Friday: 9:00 AM – 5:00 PM", 
                            "Saturday: 9:00 AM – 5:00 PM", 
                            "Sunday: 9:00 AM – 5:00 PM"
                        ],
                        "",5);
    let poi4=createPOI("大溪老街",
                        "桃園市",
                        "桃園市大溪區大溪橋步道",
                        24.884918,
                        121.284541,
                        1,
                        [ 
                            "Monday: 7:00 AM – 5:00 PM", 
                            "Tuesday: 7:00 AM – 5:00 PM", 
                            "Wednesday: 7:00 AM – 5:00 PM", 
                            "Thursday: 7:00 AM – 5:00 PM", 
                            "Friday: 7:00 AM – 5:00 PM", 
                            "Saturday: 7:00 AM – 5:00 PM", 
                            "Sunday: 7:00 AM – 5:00 PM"
                        ],
                        "",5);
    let poi5=createPOI("富田花園農場",
                        "桃園縣",
                        "桃園縣大溪鎮福安里埤尾22-8號",
                        24.839497, 
                        121.288128,
                        1,
                        [ 
                            "Monday: 9:00 AM – 6:00 PM", 
                            "Tuesday: 9:00 AM – 6:00 PM", 
                            "Wednesday: 9:00 AM – 6:00 PM", 
                            "Thursday: 9:00 AM – 6:00 PM", 
                            "Friday: 9:00 AM – 6:00 PM", 
                            "Saturday: 9:00 AM – 6:00 PM", 
                            "Sunday: 9:00 AM – 6:00 PM"
                        ],
                        "",5);
    let poi6=createPOI("SNOOPY Play Center",
                        "桃園市",
                        "桃園市中壢區春德路189號",
                        25.014572, 
                        121.212705,
                        1,
                        [ 
                            "Monday: 10:00 AM – 9:00 PM", 
                            "Tuesday: 10:00 AM – 9:00 PM", 
                            "Wednesday: 10:00 AM – 9:00 PM", 
                            "Thursday: 10:00 AM – 9:00 PM", 
                            "Friday: 10:00 AM – 10:00 PM", 
                            "Saturday: 10:00 AM – 10:00 PM", 
                            "Sunday: 10:00 AM – 9:00 PM"
                        ],
                        "",5);
    let poi7=createPOI("慧縈家",
                        "台北市",
                        "台北市內湖區瑞光路122巷41弄10號",
                        25.071741, 
                        121.579868,
                        1,
                        null,
                        "",5);
                        
    
    let pois:Array<any>=[poi1,poi2,poi3,poi4,poi5,poi6,poi7];
    // await save_datas("dating","POI_all",pois);
    // Tool.datanmsg(`${start_time.toString()}`);
    await data(start_time);
    // POImap.printAllpoi();
    await createPairWise(50,1.3);
 }
 run();