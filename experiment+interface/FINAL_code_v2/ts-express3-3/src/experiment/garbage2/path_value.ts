import Vector from '../algorithm/Vector';
import Node from '../algorithm/Node';
import POI from '../algorithm/POI';
import POImap from '../algorithm/POImap';
import Time from '../algorithm/Time';
import vzTaiwan from '../preprocess/vzTaiwan';
import { Result, detail, weekTime, dayTime, timeStatus, timeString, request, constraint,experiment,expSetting,random_pair,testDataNames, Path, edgeDictionary} from '../algorithm/record';
import Tool from '../algorithm/Tool';
import {DBAsync} from '../database/DBAsync';
import { ObjectID } from 'mongodb';

interface valueDictionary {
    [index: string]: valueEdge;
}
interface valueEdge {
    [index: string]: valueData;
}
interface valueData {
    dis:number;
    travelTime:number;
}
interface mv{
    sum:number;
    mean:number;
}
interface create_field_data{
    exp_id:string;
    exp_index:number;
    value:number;
}
function ini_attration():mv{
    let attration_sum:number=0;
    let attration_mean:number=0;
    let N:number = POImap.pois.length;
    for (let poi of POImap.pois){
        attration_sum+=poi.global_attraction;
    }
    attration_mean = attration_sum/N;
    let data:mv={
        mean:attration_mean,
        sum:attration_sum
    }
    return data;
}
/*pairEdge是key->value的資料結構*/
function ini_edge(){
    for (let from in POImap.pairEdge) {
        for (let to in POImap.pairEdge[from]) {
            let distance: number = POImap.pairEdge[from][to].distance;//可能有null(15km限制)
            if (distance == null) {
                distance = <number>POImap.pairEdge[from][to].lineDistance;
            }
            let travelTime: number = POImap.pairEdge[from][to].travelTime;//可能有null(15km限制)
            if (travelTime == null) {
                travelTime = <number>POImap.pairEdge[from][to].lineTravelTime;
            }
            POImap.pairEdge[from][to].distance = distance;
            POImap.pairEdge[from][to].travelTime = travelTime;
        }
    }
}
function ini_edge_mv():Array<mv>{
    let N = POImap.pois.length;
    let dis_sum=0;
    let travelTime_sum=0;
    for (let from in POImap.pairEdge) {
        for (let to in POImap.pairEdge[from]) {
            dis_sum+=POImap.pairEdge[from][to].distance;
            travelTime_sum+=POImap.pairEdge[from][to].travelTime;
        }
    }
    let dis_mean=0;
    let travelTime_mean=0;
    dis_mean=dis_sum/(N*N);
    travelTime_mean=travelTime_sum/(N*N);
    let dis_data:mv={
        sum:dis_sum,
        mean:dis_mean
    }
    let travelTime_data:mv={
        sum:travelTime_sum,
        mean:travelTime_mean
    }
    return [dis_data,travelTime_data];
}
function calculate_path_value(exps:Array<any>,dis_data:mv,travelTime_data:mv,attraction_data:mv):Array<create_field_data>{
    let create_field_datas:Array<create_field_data>=[];
    for (let exp of exps) {
        create_field_datas.push(path_value(exp._id.toString(),exp.index,exp.Result,dis_data,travelTime_data,attraction_data));
    }
    return create_field_datas;
}
function path_value(exp_id:string,exp_index:number,Result:Result,dis_data:mv,travelTime_data:mv,attraction_data:mv):create_field_data{
    let path:Path = Result.path as Path;
    let depthLimit = Result.depthLimit as number;
    let value = 0;
    for (let node of path) {
        if(node.depth!=0&&node.depth<depthLimit){
            let parent_id = node.parent.poi._id;
            let now_id = node.poi._id;
            let attraction = node.poi.global_attraction;
            let dis =  POImap.pairEdge[parent_id][now_id].distance;
            let travelTime = POImap.pairEdge[parent_id][now_id].travelTime;
            let alpha:number = 0.2;
            value += sigmoid_min(dis,dis_data.mean,alpha)+sigmoid_max(attraction,attraction_data.mean,alpha)+sigmoid_min(travelTime,travelTime_data.mean,alpha);
        
        }
    }
    let data:create_field_data={
        exp_id:exp_id,
        exp_index:exp_index,
        value:value
    }
    return data;

}
function sigmoid_min(x:number,mean:number,alpha:number):number{
    return Math.exp(alpha*(-x+mean))/(1+Math.exp(alpha*(-x+mean)));
}
function sigmoid_max(x:number,mean:number,alpha:number):number{
    return 1/(1+Math.exp(-x+mean));
}
async function data() {
    let db=await DBAsync.connectDBAsync("finaldata");//poitest/finaldata/small_pois/small_pois2
    let coll=await DBAsync.coll(db,"POI_all");//poi/POI_all
    let pois=await DBAsync.find(coll, {}, {});
    let poi_num: number = 0;
    for (let poi of pois) {
        let weekTime: weekTime = vzTaiwan.weekday_textParsing(poi.open_time);
        let now: POI = new POI(poi.name, poi.rating, poi._id.toString()/*, 0*/, poi.lat, poi.lng, poi.stay_time, weekTime);
        POImap.insertPoi(now);
        poi_num++;
    }
    Tool.actionmsg('get POIs from mongodb over');
    Tool.datanmsg(`number of poi:${poi_num}`);
    
    coll=await DBAsync.coll(db,"yilanpairwise_all");//pairWise/yilanpairwise/yilanpairwise_all
    let pairWises=await DBAsync.find(coll, {}, { from: 1, to: 1, distance: 1, travelTime: 1,lineDistance:1, lineTravelTime:1});
    let pairWises_num: number = 0;
    for (let pairWise of pairWises) {
        POImap.insertPairEdge(pairWise.from, pairWise.to, pairWise.distance, pairWise.travelTime, pairWise.lineDistance, pairWise.lineTravelTime);
        pairWises_num++;
    }
    Tool.actionmsg('get pairWises from mongodb over');
    Tool.datanmsg(`number of pairWise:${pairWises_num}`);
    await DBAsync.closeDB();
}
async function exp_data(dbName:string,collName:string) {
    let db = await DBAsync.connectDBAsync(dbName);
    let coll = await DBAsync.coll(db, collName);
    let exps = await DBAsync.find(coll, {}, {});
    await DBAsync.closeDB();
    return exps;
}
async function save_value(DBname:string,collName:string,create_field_datas:Array<create_field_data>){
    let db=await DBAsync.connectDBAsync(DBname);
    let coll=await DBAsync.coll(db,collName);
    for(let create_field_data of create_field_datas){
        await DBAsync.create_field(coll,create_field_data.exp_id,
            {
                "value":create_field_data.value
            }
        )
    }
    await DBAsync.closeDB();
}
async function run(){
    //1. 取得全部的poi和edge
    await  data();
    POImap.reverse();
    ini_edge();
    let edge_mv:Array<mv>=ini_edge_mv();
    let dis_data:mv = edge_mv[0];
    let travelTime_data:mv = edge_mv[1];
    let attraction_data:mv= ini_attration();
    let dbName:string = "exp_final";
    let collNames:Array<string>=["a+h+prune", "d+h+prune","t+h+prune","a+d+h+prune","a+d+t+h+prune"]
    //4. 取得全部的Result
    for(let collName of collNames){
        let exps=await exp_data(dbName,collName);
        console.log(`result_data_length: ${exps.length}\n`);
        //5. 計算路線的滿意度機率
        let create_field_datas:Array<create_field_data> = calculate_path_value(exps,dis_data,travelTime_data,attraction_data);
        await save_value(dbName,collName,create_field_datas);
    }
}
run();