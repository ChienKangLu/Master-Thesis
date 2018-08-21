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
    dis_m:number;
    dis_f:number;
    dis_p:number;
}
interface dis_mv{
    dis_sum:number,
    dis_mean:number,
    dis_variance:number
}
interface attraction_mv{
    attraction_sum:number,
    attraction_mean:number,
}
// interface travelTime_mv{
//     travelTime_sum:number,
//     travelTime_mean:number,
//     travelTime_variance:number
// }
interface create_field_data{
    exp_id:string;
    exp_index:number;
    probability:number;
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
function ini_attration():attraction_mv{
    let attration_sum:number=0;
    let attration_mean:number=0;
    let N:number = POImap.pois.length;
    for (let poi of POImap.pois){
        attration_sum+=poi.global_attraction;
    }
    attration_mean = attration_sum/N;
    let data:attraction_mv={
        attraction_mean:attration_mean,
        attraction_sum:attration_sum
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
function ini_dis_mean_dis_variance():dis_mv{
    let N = POImap.pois.length;
    let dis_sum=0;
    for (let from in POImap.pairEdge) {
        for (let to in POImap.pairEdge[from]) {
            dis_sum+=POImap.pairEdge[from][to].distance;
        }
    }
    let dis_mean=0;
    let dis_variance=0;
    dis_mean=dis_sum/(N*N);
    for (let from in POImap.pairEdge) {
        for (let to in POImap.pairEdge[from]) {
            dis_variance+=Math.pow(POImap.pairEdge[from][to].distance-dis_mean,2);
        }
    }
    dis_variance=dis_variance/(N*N);
    let data:dis_mv={
        dis_sum:dis_sum,
        dis_mean:dis_mean,
        dis_variance:dis_variance
    }
    return data;
}
function ini_dis_m_f_p(dis_mv:dis_mv):valueDictionary{
    let dis_mean:number=dis_mv.dis_mean;
    let dis_variance:number=dis_mv.dis_variance;
    let dis_sum:number = dis_mv.dis_sum;
    let N = POImap.pois.length;
    let dis_value:valueDictionary ={};
    for (let from in POImap.pairEdge) {
        if (dis_value[from] == null) {
            let edge: valueEdge = {};
            dis_value[from] = edge;
        }
        let sum_dis_f = 0;
        for (let to in POImap.pairEdge[from]) {
            let dis:number = POImap.pairEdge[from][to].distance;
            let dis_m:number = normal_square(dis,dis_mean,dis_variance);
            let dis_f:number = epx_(dis_m);
            let dis_p:number= 0
            
            let valueData: valueData = {dis,dis_m,dis_f,dis_p};
            dis_value[from][to] = valueData;
            sum_dis_f+=dis_f;
        }
        // for (let to in POImap.pairEdge[from]) {
        //     dis_value[from][to].dis_p = dis_value[from][to].dis_f/sum_dis_f;
        // }
    }
    return dis_value;
}
function normal_square(x:number,mean:number,variance:number){//teacher
    return (Math.pow(x-mean,2))/(2*variance);
}
function epx_(x:number):number{
    return Math.exp(-x);
}
async function exp_data(dbName:string,collName:string) {
    let db = await DBAsync.connectDBAsync(dbName);
    let coll = await DBAsync.coll(db, collName);
    let exps = await DBAsync.find(coll, {}, {});
    await DBAsync.closeDB();
    return exps;
}
function calculate_path_satisfy_probability(exps:Array<any>,valueDictionary:valueDictionary,dis_mv:dis_mv,attraction_mv:attraction_mv):Array<create_field_data>{
    let create_field_datas:Array<create_field_data>=[];
    for (let exp of exps) {
        create_field_datas.push(path_satisfy_probability(exp._id.toString(),exp.index,exp.Result,valueDictionary,dis_mv,attraction_mv));
        console.log(exp.index);
        // break;
    }
    return create_field_datas;
}
function path_satisfy_probability(exp_id:string,exp_index:number,Result:Result,valueDictionary:valueDictionary,dis_mv:dis_mv,attraction_mv:attraction_mv):create_field_data{
    let path:Path = Result.path as Path;
    let depthLimit = Result.depthLimit as number;
    console.log(`exp_id:${exp_id}`);
    console.log(`depthLimit:${depthLimit}`);
    let probability = 1;
    for (let node of path) {
        if(node.depth!=0&&node.depth<depthLimit){
            let cost:number = node.poi.global_attraction_cost;
            let parent_id = node.parent.poi._id;
            let parent_name = node.parent.poi.name;
            let now_id = node.poi._id;
            let now_name = node.poi.name;
            let now_depth = node.depth;
            let dis =  valueDictionary[parent_id][now_id].dis;
            let dis_f = valueDictionary[parent_id][now_id].dis_f;
            let dis_p = valueDictionary[parent_id][now_id].dis_p;
            let alpha:number = 0.2;
            probability = probability*sigmoid1(dis,dis_mv.dis_mean,alpha)*sigmoid2(node.poi.global_attraction,attraction_mv.attraction_mean,alpha);
            // probability = probability*sigmoid(dis,dis_mv.dis_mean,0.2)*s(node.poi.global_attraction_cost);
           
            // console.log(dis_mv.dis_mean);
            // console.log(parent_name,parent_id);
            // console.log(node.poi.global_attraction,cost);
            // console.log(now_depth,now_name,now_id);
            // console.log(valueDictionary[parent_id][now_id]);
        }
    }
    let data:create_field_data={
        exp_id:exp_id,
        exp_index:exp_index,
        probability:probability
    }
    // console.log(JSON.stringify(data));
    return data;

}
function sigmoid1(x:number,mean:number,alpha:number):number{
    return Math.exp(alpha*(-x+mean))/(1+Math.exp(alpha*(-x+mean)));
    // return 1/(1+Math.exp(-x+mean));
}
function sigmoid2(x:number,mean:number,alpha:number):number{
    // return Math.exp(alpha*(-x+mean))/(1+Math.exp(alpha*(-x+mean)));
    return 1/(1+Math.exp(-x+mean));
}
function s(cost:number) {
    return Math.exp(-cost);
}
async function save_probability(DBname:string,collName:string,create_field_datas:Array<create_field_data>){
    let db=await DBAsync.connectDBAsync(DBname);
    let coll=await DBAsync.coll(db,collName);
    for(let create_field_data of create_field_datas){
        console.log(`save exp index: ${create_field_data.exp_index}`)
        await DBAsync.create_field(coll,create_field_data.exp_id,
            {
                "probability":create_field_data.probability
            }
        )
    }
    await DBAsync.closeDB();
}

async function run(){
    //1. 取得全部的poi和edge
    await  data();
    //2. 計算attraction cost
    POImap.reverse();
    //3. 計算poi滿意度以及轉移合理性
    ini_edge();
    let dis_mv:dis_mv=ini_dis_mean_dis_variance();
    let valueDictionary:valueDictionary =ini_dis_m_f_p(dis_mv);
    let attraction_mv:attraction_mv= ini_attration();
    // console.log(JSON.stringify(valueDictionary,null,2))
    let dbName:string = "exp_final";
    /**
     * "exp_distance-heuristic-weekTime-reasonable"
     * "exp_expectation-heuristic-distance-heuristic-weekTime-reasonable"
     * "exp_expectation-heuristic-weekTime-reasonable"
     */
    let collNames:Array<string>=["a+h+prune", "d+h+prune","t+h+prune","a+d+h+prune","a+d+t+h+prune"]
    //4. 取得全部的Result
    for(let collName of collNames){
        let exps=await exp_data(dbName,collName);
        console.log(`result_data_length: ${exps.length}\n`);
        //5. 計算路線的滿意度機率
        let create_field_datas:Array<create_field_data> = calculate_path_satisfy_probability(exps,valueDictionary,dis_mv,attraction_mv);
        await save_probability(dbName,collName,create_field_datas);
    }
}
run();