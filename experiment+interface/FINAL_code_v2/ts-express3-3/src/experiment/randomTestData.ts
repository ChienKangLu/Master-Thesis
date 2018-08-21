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

let start_time: Time = new Time(undefined, 2017, 10, 30, 8, 0, 0);

//[step 1] 取出資料庫內全部的POI並且存入POImap
async function data(start_time:Time) {
    let db=await DBAsync.connectDBAsync("finaldata");//poitest/finaldata
            let coll=await DBAsync.coll(db,"POI_all");//poi/POI_all
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

//[step 2] 移除不符合時間條件的POI
async function filterTime(start_time:Time,AM:number,PM:number){
    let nowWeek:number=start_time.time.getDay();
    let pois_new:Array<POI>=[];
    Tool.datanmsg(`nowWeek:${nowWeek}`);
    /**
     * https://stackoverflow.com/questions/10179815/how-do-you-get-the-loop-counter-index-using-a-for-in-syntax-in-javascript
     */
    for(let poi of POImap.pois){
        let dayTime:dayTime=poi.weekTime[nowWeek];
        //one poi may have a lot of timeStatus in one day
        //只要有一個timeStatus符合就加入新的pois
        for(let timeStatus_index in dayTime){
            let timeStatus:timeStatus=dayTime[timeStatus_index];
            if(timeStatus.status=="Open24hours"){
                pois_new.push(poi);
                break;
            }else if(timeStatus.status=="Open"){
                let openTimeString:timeString = <timeString>timeStatus.open;
                let closeTimeString:timeString = <timeString>timeStatus.close;
                if(<timeString>openTimeString.hour<=AM && <timeString>openTimeString.stamp=="AM" &&
                    <timeString>closeTimeString.hour>=PM && <timeString>closeTimeString.stamp=="PM"){
                    /**
                     * http://www.hostingadvice.com/how-to/javascript-remove-element-array/
                     */
                    pois_new.push(poi);
                    break;
                }else{
                    // Tool.datanmsg(`${poi.name}(${poi.global_attraction}):${<timeString>openTimeString.hour} ${<timeString>openTimeString.stamp}~${<timeString>closeTimeString.hour} ${<timeString>closeTimeString.stamp}`);
                }
            }
        }
    }
    POImap.pois=pois_new;
}

//[step 3] 產生不重複的randomNum對index，random_pairs
async function randomIndex(randomNum:number) {
    //直接random產生
    let poiNumber:number = POImap.pois.length;
    let random_pairs: Array<random_pair> = [];
    for (let i: number = 0; i < randomNum; i++) {
        let same:boolean = true;
        while(same){
            same = false;
            let from_idx: number = Tool.getRandomInt(0, poiNumber - 1);
            let to_idx: number = Tool.getRandomIntWithout(0, poiNumber - 1, from_idx);
            random_pairs[i] = {
                from_idx: from_idx,
                to_idx: to_idx
            }
            for (let j: number = 0; j < i-1; j++) {
                if(random_pairs[i].from_idx==random_pairs[j].from_idx && random_pairs[i].to_idx==random_pairs[j].to_idx){
                    same = true;
                    break;
                }
            }
        }
    }
    return random_pairs;
}

//[step 4] random_pairs轉成testDataNames陣列
async function random_pairs2testDataNames(random_pairs: Array<random_pair>){
    let testDataNames:testDataNames = [];
    for(let [index,random_pair] of random_pairs.entries()){
        testDataNames.push({
            'index': index, 
            'startName': POImap.pois[random_pair.from_idx].name, 
            'destinationName':  POImap.pois[random_pair.to_idx].name
        })
    }
    return testDataNames;
}

//[step 6] testDataNames存入DB
async function save_testDataNames(DBname:string,testDataNames:testDataNames,collname:string){
    let db=await DBAsync.connectDBAsync(DBname);
    let coll=await DBAsync.coll(db,collname);
    await DBAsync.insertMany(coll,testDataNames);
    await DBAsync.closeDB();
}

async function run(){
    Tool.datanmsg(`${start_time.toString()}`);
    await data(start_time);
    // await filterTime(start_time,8,8); //8am 8pm (只留24小時開門的以及開門時間小於等於8am且關門時間大於等於8pm)
    await filterTime(start_time,8,11); //8am 11pm (只留24小時開門的以及開門時間小於等於8am且關門時間大於等於8pm)
    Tool.datanmsg(`number of poi after filter:${POImap.pois.length}`);
    let random_pairs: Array<random_pair> = await randomIndex(1000);
    Tool.datanmsg(`number of random_pairs:${random_pairs.length}`);
    let testDataNames = await random_pairs2testDataNames(random_pairs);
    let DBname:string = "paper-data";
    let collname:string = "8am-11pm";
    await save_testDataNames(DBname,testDataNames,collname);
}
run();