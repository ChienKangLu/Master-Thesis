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
import { normalize } from 'path';

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
interface create_field_data{
    exp_id:string;
    exp_index:number;
    value:number;
}
interface satisfy{
    s_distance:number,
    s_attraction:number,
    tol_distance:number,
    tol_attraction:number
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

function calculate_path_value(exps:Array<any>,satisfy:satisfy):Array<create_field_data>{
    let create_field_datas:Array<create_field_data>=[];
    for (let exp of exps) {
        create_field_datas.push(path_value(exp._id.toString(),exp.index,exp.Result,satisfy));
    }
    return create_field_datas;
}
function path_value(exp_id:string,exp_index:number,Result:Result,satisfy:satisfy):create_field_data{
    let path:Path = Result.path as Path;
    let depthLimit = Result.depthLimit as number;
    let value = 0;
    for (let node of path) {
        let now_id = node.poi._id;
        //edge
        if(node.depth>0){
            let parent_id = node.parent.poi._id;
            let distance =  POImap.pairEdge[parent_id][now_id].distance;
            let travelTime = POImap.pairEdge[parent_id][now_id].travelTime;
            value += f(distance,satisfy.s_distance,satisfy.tol_distance);
        }
        //vertice
        if(node.depth>0&&node.depth<depthLimit){
            let attraction_cost = node.poi.global_attraction_cost;
            value += f(attraction_cost,satisfy.s_attraction,satisfy.tol_attraction);
        }

    }
    let data:create_field_data={
        exp_id:exp_id,
        exp_index:exp_index,
        value:value
    }
    return data;

}
function f(x:number,s:number,tol:number){
    let normal_distance = normal(x,s,tol);
    let us = sigmoid(normal_distance,0.5);
    // console.log(s,tol);
    return us;
}
function normal(x:number,s:number,tol:number):number{
    return (x-s)/tol;
}
function sigmoid(x:number,alpha:number):number{
    return 1/(1+Math.exp(-alpha*x));
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
async function save_value(DBname:string,collName:string,create_field_datas:Array<create_field_data>,setting:any){
    let db=await DBAsync.connectDBAsync(DBname);
    let coll=await DBAsync.coll(db,collName);
    let attr_name = "a"+setting.a+"d"+setting.d;
    for(let create_field_data of create_field_datas){
        await DBAsync.create_field(coll,create_field_data.exp_id,
            {
                [attr_name]:create_field_data.value
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
    
    let max_attraction:number =5;
    let dbName1:string = "chapter6_2_1";
    let collNames1:Array<string>= ["d+prune+h(8am,8pm)","a4+d5+prune+h(8am,8pm)","a4+d10+prune+h(8am,8pm)","a4+d20+prune+h(8am,8pm)",
                 "a3.5+d20+prune+h(8am,8pm)","a4.5+d20+prune+h(8am,8pm)"];
    let dbName2:string = "chapter5";
    let collNames2:Array<string>= ["a+prune+h(8am,8pm)"];
    let dbName3:string = "chapter6_2_2_Limit5mins";
    let collNames3:Array<string>= ["xxx","a4+d5(8am,8pm)","a4+d10(8am,8pm)","a4+d20(8am,8pm)",
                 "a3.5+d20(8am,8pm)","a4.5+d20(8am,8pm)"];
    let dbName4:string = "chapter8";
    let collNames4:Array<string>= ["xxx","a4+d5+prune+h+tuning0.05(8am,8pm)","a4+d10+prune+h+tuning0.05(8am,8pm)","a4+d20+prune+h+tuning0.05(8am,8pm)",
    "a3.5+d20+prune+h+tuning0.05(8am,8pm)","a4.5+d20+prune+h+tuning0.05(8am,8pm)"];
    let setting:Array<any>=[{},{a:4,d:5},{a:4,d:10},{a:4,d:20},{a:3.5,d:20},{a:4.5,d:20}];


    // let set:number = 5;//1 2 3 4 5
    let dbName:string = dbName4;
    let collNames:Array<string> = collNames4;
    for(let set=1;set<=5;set++){
        console.log(`set:${set}`)
        let indexs:Array<number>=[0,set]
        let satisfy:satisfy={
            s_distance:setting[set].d,
            s_attraction:max_attraction-setting[set].a,
            tol_distance:1,
            tol_attraction:0.1
        };
        //4. 取得全部的Result
        for(let index of indexs){
            let exps=await exp_data(dbName,collNames[index]);
            console.log(dbName,collNames[index])
            console.log(`result_data_length: ${exps.length}\n`);
            //5. 計算路線的滿意度機率
            let create_field_datas:Array<create_field_data> = calculate_path_value(exps,satisfy);
            await save_value(dbName,collNames[index],create_field_datas,setting[set]);
        }

        // let exps=await exp_data(dbName2,collNames2[0]);
        // console.log(dbName2,collNames2[0])
        // console.log(`result_data_length: ${exps.length}\n`);
        // //5. 計算路線的滿意度機率
        // let create_field_datas:Array<create_field_data> = calculate_path_value(exps,satisfy);
        // await save_value(dbName2,collNames2[0],create_field_datas,setting[set]);
    }
    /**
     * db.getCollection('d+prune+h(8am,8pm)').update({},{$unset:{attr_name:1}},{multi: true})
     */

    /**
     * Keep in mind smaller path value is better!!!!!!!!!!
     */
}
run();