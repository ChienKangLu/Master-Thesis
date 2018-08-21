import Vector from '../algorithm/Vector';
import Node from '../algorithm/Node';
import POI from '../algorithm/POI';
import POImap from '../algorithm/POImap';
import PriorityQueue from '../algorithm/PriorityQueue';
import Astar from '../algorithm/Astar';
import Time from '../algorithm/Time';
import vzTaiwan from '../preprocess/vzTaiwan';
import { Result, detail, weekTime, dayTime, timeStatus, timeString, request, constraint,experiment } from '../algorithm/record';
import Tool from '../algorithm/Tool';
import {DBAsync} from '../database/DBAsync';

class exp1Async {
    constructor() {
    }
    async run(){
        
        for(let i:number=1;i<=100;i++){
            await this.data();
            let random:number=Tool.getRandomInt(0,POImap.pois.length-1);
            let random2:number=Tool.getRandomIntWithout(0,POImap.pois.length-1,random);
            POImap.clear();
            Vector.clear();
            for(let depth:number=1;depth<=10;depth++){
                await this.data();
                Tool.expmsg(`index:${i},depth:${depth}`);
                let start_id:string=POImap.pois[random]._id;
                let destination_id:string=POImap.pois[random2]._id;
                let start_time:Time=new Time(undefined, 2017, 10, 30, 8, 0, 0);
                let time_budget:number=12;
                let orderIndex:Array<number>=[Node.index_attraction/*, Node.index_distance, Node.index_travelTime*/];
                let setting=this.setting(start_id,destination_id,start_time,time_budget,depth,orderIndex,60*1000);
                let request=setting[0];
                let constraint=setting[1];
                let complete=this.excute(request,constraint);
                await this.saveDB("exp1",i,complete[1],time_budget,depth,orderIndex);
                Tool.expmsg(`save to DB`);

                if(!complete[0]){
                    break;
                }

            }
        }

    }
    async data() {
        let db=await DBAsync.connectDBAsync("poitest");
        let coll=await DBAsync.coll(db,"poi");
        let pois=await DBAsync.find(coll, {}, {});
        let poi_num: number = 0;
        for (let poi of pois) {
            let weekTime: weekTime = vzTaiwan.weekday_textParsing(poi.open_time);
            let now: POI = new POI(poi.name, poi.rating, poi._id/*, 0*/, poi.lat, poi.lng, poi.stay_time, weekTime);
            POImap.insertPoi(now);
            poi_num++;
        }
        Tool.actionmsg('get POIs from mongodb over');
        Tool.datanmsg(`number of poi:${poi_num}`);
        
        coll=await DBAsync.coll(db,"pairWise");
        let pairWises=await DBAsync.find(coll, {}, { from: 1, to: 1, distance: 1, travelTime: 1 });
        let pairWises_num: number = 0;
        for (let pairWise of pairWises) {
            POImap.insertPairEdge(pairWise.from, pairWise.to, pairWise.distance, pairWise.travelTime);
            pairWises_num++;
        }
        Tool.actionmsg('get pairWises from mongodb over');
        Tool.datanmsg(`number of pairWise:${pairWises_num}`);
        await DBAsync.closeDB();
    }
    setting(start_id:string,destination_id:string,start_time:Time,time_budget:number,depth:number,orderIndex:Array<number>,exp_wait:number): Array<any> {
        let end_time:Time=start_time.add(time_budget,"hour");//variable
        let request: request = {
            start_time: start_time,
            end_time:  end_time,
            start_id: start_id,
            destination_id: destination_id,
            orderIndex: orderIndex,
            depthLimit: depth,
            mustVisit_order: [{ _id: destination_id, order: depth }],//終點是已經決定好的
            exp_wait:exp_wait
        }
        let constraint: constraint = {
            considerWeekTime: true,
            considerMustVisit_order: true,
            timer: true
        }
        return [request,constraint];
    }

    excute(request:request, constraint:constraint):Array<any>{
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
        if(Result.pathString!=undefined){
            return [true,Result];
        }
        return [false,Result];
    }
    async saveDB(expName:string,index:number,Result:Result,time_budget:number,depth:number,orderIndex:Array<number>){
        let db=await DBAsync.connectDBAsync("experiment");
        let coll=await DBAsync.coll(db,expName);
        let exp:experiment={
            index:index,
            Result:Result,
            time_budget:time_budget,
            depth:depth,
            orderIndex:orderIndex
        }
        await DBAsync.insert(coll,exp);
        await DBAsync.closeDB();
    }
}
let expAsync=new exp1Async();
expAsync.run();