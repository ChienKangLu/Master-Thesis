import Vector from '../algorithm/Vector';
import Node from '../algorithm/Node';
import POI from '../algorithm/POI';
import POImap from '../algorithm/POImap';
import PriorityQueue from '../algorithm/PriorityQueue';
import Astar from '../algorithm/Astar';
import Time from '../algorithm/Time';
import vzTaiwan from '../preprocess/vzTaiwan';
import { Result, detail, weekTime, dayTime, timeStatus, timeString, request, constraint,experiment,expSetting,random_pair,testDataNames, Path, visit_order} from '../algorithm/record';
import Tool from '../algorithm/Tool';
import {DBAsync} from '../database/DBAsync';

export class Trip_v3{
    start_id:string;
    destination_id:string;
    start_time:Date;
    end_time:Date;
    depth:number;
    s_attr:number;
    s_dis:number;
    s_travel:number;
    considerMustVisit_order:boolean;
    considerMustNotVist:boolean;
    mustVisit_order:Array<visit_order>;
    mustNotVist:Array<string>
    callback:(Result:Result)=>void;
    constructor(start_id:string,destination_id:string,start_time:Date,
        end_time:Date,depth:number,s_attr:number,s_dis:number,s_travel:number,considerMustVisit_order:boolean,considerMustNotVist:boolean,mustVisit_order:Array<visit_order>,mustNotVist:Array<string>,callback:(Result:Result)=>void) {
            this.start_id=start_id;
            this.destination_id=destination_id;
            this.start_time=start_time;
            this.end_time=end_time;
            this.depth=depth;
            this.s_attr=s_attr;
            this.s_dis=s_dis;
            this.s_travel=s_travel;
            this.callback = callback;
            this.considerMustVisit_order=considerMustVisit_order;
            this.considerMustNotVist=considerMustNotVist;
            this.mustVisit_order=mustVisit_order;
            this.mustNotVist=mustNotVist;
            
    }
    async run(){
        let userSetting:expSetting={//0
                DBname:"", // not use in this class
                expName:"", // not use in this class
                attribution:[Node.index_attraction,Node.index_distance,Node.index_travelTime],
                attraction_heuristic:true,
                distance_heuristic:true,
                travelTime_heuristic:true,
                edgeExcept_heuristic:false,
                attraction_expect_type:"attraction_expect_square",
                dataStructure:"minheap",
                openlist_comparator:"comparater_heap_sum",
                km15:false,
                nodeLimitNumber:0,
                considerWeekTime:true,
                considerReasonable:true,
                validateEnd:false,
                user_specify:true,
                attr_unit_mean:[this.s_attr,this.s_dis,this.s_travel],
                attr_unit_sd:[0.1,1,0.25],
                start_time:0,// not use in this class
                duration:0,// not use in this class
                tuning:false// not use in this class
        };
        await this.data();
        
        Tool.expmsg(`------------------------------------------------`);
        Tool.expmsg(`start exp time:${new Date()}`);
        Tool.expmsg(`depth:${this.depth}`);
        
        let start_time: Time = new Time(this.start_time);
        let end_time: Time = new Time(this.end_time);
        let orderIndex: Array<number> = userSetting.attribution;
        let setting = this.setting(this.start_id, this.destination_id, start_time, end_time, this.depth, orderIndex, userSetting);
        let request = setting[0];
        let constraint = setting[1];
        let result:Result = this.excute(request, constraint);
        this.callback(result);
                
    }
    async data() {
        let db=await DBAsync.connectDBAsync("finaldata");//poitest/finaldata/small_pois/small_pois2
        let coll=await DBAsync.coll(db,"POI_all");//poi/POI_all
        let pois=await DBAsync.find(coll, {}, {});
        let poi_num: number = 0;
        for (let poi of pois) {
            let weekTime: weekTime = vzTaiwan.weekday_textParsing(poi.open_time);
            let now: POI = new POI(poi.name, poi.rating, poi._id.toString()/*, 0*/, poi.lat, poi.lng, poi.stay_time, weekTime,poi.introduction);
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
    
    setting(start_id:string,destination_id:string,start_time:Time, end_time:Time,depth:number,orderIndex:Array<number>,expSetting:expSetting): Array<any> {
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
        if(this.considerMustNotVist){
            request.mustNotVist=this.mustNotVist;
            constraint.considerMustNotVist=this.considerMustNotVist;
        }
        if(this.considerMustVisit_order){
            request.mustVisit_order=this.mustVisit_order;
            constraint.considerMustVisit_order=this.considerMustVisit_order;
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
        Result.excutionTime = run_end.getTime() - run_start.getTime();//millionseconds
        return Result;
    }
}