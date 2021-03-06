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

class chapter7 {
    constructor() {
    }
    async run(){
        let run_start: Date = new Date;
        let DBname : string = "chapter7";
        let expSettings:Array<expSetting>=[
            {//0
                DBname:DBname,
                expName:"a4+d5+e3+prune+h(8am,8pm)",
                attribution:[Node.index_attraction,Node.index_distance,Node.index_edgeExcept],
                attraction_heuristic:true,
                distance_heuristic:true,
                travelTime_heuristic:false,
                edgeExcept_heuristic:true,
                attraction_expect_type:"attraction_expect_square",
                dataStructure:"minheap",
                openlist_comparator:"comparater_heap_sum",
                km15:false,
                nodeLimitNumber:0,
                considerWeekTime:true,
                considerReasonable:true,
                validateEnd:false,
                user_specify:true,
                attr_unit_mean:[4,5,3],
                attr_unit_sd:[0.1,1,1],
                start_time:8,
                duration:12,
                tuning:false
            }
            //,
            // {//1
            //     DBname:DBname,
            //     expName:"a4+d10+e3+prune+h(8am,8pm)",
            //     attribution:[Node.index_attraction,Node.index_distance,Node.index_edgeExcept],
            //     attraction_heuristic:true,
            //     distance_heuristic:true,
            //     travelTime_heuristic:false,
            //     edgeExcept_heuristic:true,
            //     attraction_expect_type:"attraction_expect_square",
            //     dataStructure:"minheap",
            //     openlist_comparator:"comparater_heap_sum",
            //     km15:false,
            //     nodeLimitNumber:0,
            //     considerWeekTime:true,
            //     considerReasonable:true,
            //     validateEnd:false,
            //     user_specify:true,
            //     attr_unit_mean:[4,10,3],
            //     attr_unit_sd:[0.1,1,1],
            //     start_time:8,
            //     duration:12,
            //     tuning:false
            // },
            // {//2
            //     DBname:DBname,
            //     expName:"a4+d20+e3+prune+h(8am,8pm)",
            //     attribution:[Node.index_attraction,Node.index_distance,Node.index_edgeExcept],
            //     attraction_heuristic:true,
            //     distance_heuristic:true,
            //     travelTime_heuristic:false,
            //     edgeExcept_heuristic:true,
            //     attraction_expect_type:"attraction_expect_square",
            //     dataStructure:"minheap",
            //     openlist_comparator:"comparater_heap_sum",
            //     km15:false,
            //     nodeLimitNumber:0,
            //     considerWeekTime:true,
            //     considerReasonable:true,
            //     validateEnd:false,
            //     user_specify:true,
            //     attr_unit_mean:[4,20,3],
            //     attr_unit_sd:[0.1,1,1],
            //     start_time:8,
            //     duration:12,
            //     tuning:false
            // }
            // {//3
            //     DBname:DBname,
            //     expName:"a3.5+d20+prune+h(8am,8pm)",
            //     attribution:[Node.index_attraction,Node.index_distance,Node.index_edgeExcept],
            //     attraction_heuristic:true,
            //     distance_heuristic:true,
            //     travelTime_heuristic:false,
            //     edgeExcept_heuristic:true,
            //     attraction_expect_type:"attraction_expect_square",
            //     dataStructure:"minheap",
            //     openlist_comparator:"comparater_heap_sum",
            //     km15:false,
            //     nodeLimitNumber:0,
            //     considerWeekTime:true,
            //     considerReasonable:true,
            //     validateEnd:false,
            //     user_specify:true,
            //     attr_unit_mean:[3.5,20,3],
            //     attr_unit_sd:[0.1,1,1],
            //     start_time:8,
            //     duration:12,
            //     tuning:false
            // },
            // {//4
            //     DBname:DBname,
            //     expName:"a4.5+d20+e3+prune+h(8am,8pm)",
            //     attribution:[Node.index_attraction,Node.index_distance,Node.index_edgeExcept],
            //     attraction_heuristic:true,
            //     distance_heuristic:true,
            //     travelTime_heuristic:false,
            //     edgeExcept_heuristic:true,
            //     attraction_expect_type:"attraction_expect_square",
            //     dataStructure:"minheap",
            //     openlist_comparator:"comparater_heap_sum",
            //     km15:false,
            //     nodeLimitNumber:0,
            //     considerWeekTime:true,
            //     considerReasonable:true,
            //     validateEnd:false,
            //     user_specify:true,
            //     attr_unit_mean:[4.5,20,3],
            //     attr_unit_sd:[0.1,1,1],
            //     start_time:8,
            //     duration:12,
            //     tuning:false
            // }
        ];
        let minDepth = 2;//2
        let maxDepth = 7;//5
        for(let expSettingIndex =0;expSettingIndex<=0;expSettingIndex++){
            let testDataNames:testDataNames = await this.getTestDataNames();
            let random_times = testDataNames.length;
            random_times = 50;//just for small amount data test
            console.log(`number of testDataNames:${random_times}`);
            let start_index:number=23;//0
            let end_index:number=23;//random_times-1
            for (let i: number = start_index; i <= end_index; i++) {
                for (let depth: number = minDepth; depth <= maxDepth; depth++) {
                    await this.data();
                    let run_now: Date = new Date;
                    let total_duration: number = run_now.getTime() - run_start.getTime();
                    Tool.expmsg(`------------------------------------------------`);
                    Tool.expmsg(`start exp time:${new Date()}`);
                    Tool.expmsg(`expSettingIndex:${expSettingIndex}`);
                    Tool.expmsg(`DBname:${expSettings[expSettingIndex].DBname}`);
                    Tool.expmsg(`expName:${expSettings[expSettingIndex].expName}`);
                    Tool.expmsg(`exp_duration:${JSON.stringify(Time.millionToDetail(total_duration))}`);
                    Tool.expmsg(`expSettingIndex:${expSettingIndex},index:${i},depth:${depth}`);
                    
                    let start_id: string = POImap.findFromPOImapByName(testDataNames[i].startName);
                    let destination_id: string = POImap.findFromPOImapByName(testDataNames[i].destinationName);

                    let start_time: Time = new Time(undefined, 2017, 10, 30, expSettings[expSettingIndex].start_time, 0, 0);
                    let time_budget: number = expSettings[expSettingIndex].duration;
                    let orderIndex: Array<number> = expSettings[expSettingIndex].attribution;
                    let setting = this.setting(start_id, destination_id, start_time, time_budget, depth, orderIndex, 60 * 1000, expSettings[expSettingIndex]);
                    let request = setting[0];
                    let constraint = setting[1];
                    let result:Result = this.excute(request, constraint);
                    await this.saveDB(expSettings[expSettingIndex].DBname, expSettings[expSettingIndex].expName, i, result, time_budget, depth, expSettings[expSettingIndex]);
                }
            }
        }
    }
    async data() {
        let db=await DBAsync.connectDBAsync("finaldata_except");//poitest/finaldata/small_pois/small_pois2
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
        let pairWises=await DBAsync.find(coll, {}, { from: 1, to: 1, distance: 1, travelTime: 1,lineDistance:1, lineTravelTime:1,except:1});
        let pairWises_num: number = 0;
        for (let pairWise of pairWises) {
            POImap.insertPairEdge(pairWise.from, pairWise.to, pairWise.distance, pairWise.travelTime, pairWise.lineDistance, pairWise.lineTravelTime, pairWise.except);
            pairWises_num++;
        }
        Tool.actionmsg('get pairWises from mongodb over');
        Tool.datanmsg(`number of pairWise:${pairWises_num}`);
        await DBAsync.closeDB();
    }
    setting(start_id:string,destination_id:string,start_time:Time,
        time_budget:number,depth:number,orderIndex:Array<number>,exp_wait:number,
        expSetting:expSetting): Array<any> {
        let end_time:Time=start_time.add(time_budget,"hour");//variable
        let request: request = {
            start_time: start_time,
            end_time:  end_time,
            start_id: start_id,
            destination_id: destination_id,
            orderIndex: orderIndex,
            depthLimit: depth
        }
        let constraint: constraint = {
            distanceLimit : false,
            timer: false
        }

        if(expSetting.attraction_heuristic){
            constraint.attraction_expect_heuristic=true;
        }
        if(expSetting.distance_heuristic){
            constraint.distance_heuristic=true;
        }
        if(expSetting.travelTime_heuristic){
            constraint.travelTime_heuristic=true;
        }
        if(expSetting.edgeExcept_heuristic){
            constraint.edgeExcept_heuristic=true;
        }
        if(expSetting.dataStructure=="minheap"){
            constraint.structure_minheap=true;
        }
        if(expSetting.openlist_comparator=="comparator_heap"){
            constraint.comparator_heap=true;
        }
        if(expSetting.openlist_comparator=="comparater_heap_sigmoid"){
            constraint.comparater_heap_sigmoid=true;
        }
        if(expSetting.openlist_comparator=="comparater_heap_normal_sigmoid"){
            constraint.comparater_heap_normal_sigmoid=true;
        }
        if(expSetting.openlist_comparator=="comparater_heap_sum"){
            constraint.comparater_heap_sum=true;
        }
        constraint.km15=expSetting.km15;

        if(expSetting.nodeLimitNumber!=0){
            constraint.nodeLimit = true;
            request.nodeLimitNumber = expSetting.nodeLimitNumber;
        }
        if(expSetting.considerWeekTime){
            constraint.considerWeekTime=true;
        }
        if(expSetting.considerReasonable){
            constraint.considerReasonable=true;
        }
        if(expSetting.validateEnd){
            constraint.validateEnd=true;
        }
        if(expSetting.attraction_expect_type == "attraction_expect_square"){
            constraint.attraction_expect_square=true;
        }
        if(expSetting.attraction_expect_type == "attraction_expect_userSpecify")
            constraint.attraction_expect_userSpecify=true;
        if(expSetting.user_specify){
            constraint.user_specify = true;
            request.attr_unit_mean= expSetting.attr_unit_mean.slice();
            request.attr_unit_sd=expSetting.attr_unit_sd.slice();
        }
        return [request,constraint];
    }

    excute(request:request, constraint:constraint):Result{
        let astar: Astar = new Astar(request, constraint);
        //---for testing---
        let run_start: Date = new Date;
        let Result: Result = astar.search();
        let run_end: Date = new Date;
        POImap.clear();
        Vector.clear();
        Tool.expmsg(`path:${Result.pathString}`); 
        Tool.expmsg(`description:${Result.description}`);
        // Tool.expmsg(`run time:${JSON.stringify(Time.millionToDetail(run_end.getTime() - run_start.getTime()))}`);
        Result.excutionTime = run_end.getTime() - run_start.getTime();//millionseconds
        // if(Result.pathString!=undefined){
        //     return [true,Result];
        // }
        // return [false,Result];
        return Result;
    }
    async saveDB(DBname:string,expName:string,index:number,Result:Result,time_budget:number,depth:number,expSetting:expSetting){
        let db=await DBAsync.connectDBAsync(DBname);
        let coll=await DBAsync.coll(db,expName);
        let exp:experiment={
            index:index,
            Result:Result,
            depth:depth,
            expSetting:expSetting
        }
        await DBAsync.insert(coll,exp);//exp
        await DBAsync.closeDB();
    }
    async getTestDataNames(){
        // let db=await DBAsync.connectDBAsync("experiment_1000");
        // let coll=await DBAsync.coll(db,"testDataNames");
        let db=await DBAsync.connectDBAsync("paper-data");
        let coll=await DBAsync.coll(db,"8am-11pm");
        let data=await DBAsync.find(coll, {}, {});
        let testDataNames:testDataNames=[]
        for (let testDataName of data) {
            testDataNames.push(testDataName);
        }
        await DBAsync.closeDB();
        return testDataNames;
    }
}
let expAsync=new chapter7();
expAsync.run();