import Vector from '../algorithm/Vector';
import Node from '../algorithm/Node';
import POI from '../algorithm/POI';
import POImap from '../algorithm/POImap';
import PriorityQueue from '../algorithm/PriorityQueue';
import Astar from '../algorithm/Astar';
import {DB,pairData} from '../database/DB';
import Time from '../algorithm/Time';
import {Result,detail} from '../algorithm/record';
import {weekTime,dayTime,timeStatus,timeString,request,constraint} from '../algorithm/record';
import vzTaiwan from '../preprocess/vzTaiwan';
import Tool from '../algorithm/Tool';
import MinHeap from '../algorithm/MinHeap';

export class Trip{
    static getPath(POIs:Array<any>,PairWises:Array<any>,start_id:string,destination_id:string,start_time:Date,
        end_time:Date,sort:Array<number>,depthLimit:number,heuristic_gate:string,km15_gate:string,callback:(Result:Result)=>void):void{
            let poi_num: number = 0;
            for (let poi of POIs) {
                let weekTime: weekTime = vzTaiwan.weekday_textParsing(poi.open_time);
                let now: POI = new POI(poi.name, poi.rating, poi._id.toString()/*, 0*/, poi.lat, poi.lng, poi.stay_time, weekTime);
                POImap.insertPoi(now);
                poi_num++;
            }
            Tool.actionmsg('get POIs from mongodb over');
            Tool.datanmsg(`number of poi:${poi_num}`);
            let pairWises_num: number = 0;
            for (let pairWise of PairWises) {
                POImap.insertPairEdge(pairWise.from, pairWise.to, pairWise.distance, pairWise.travelTime, pairWise.lineDistance, pairWise.lineTravelTime);
                pairWises_num++;
            }
            Tool.actionmsg('get pairWises from mongodb over');
            Tool.datanmsg(`number of pairWise:${pairWises_num}`);

            let request:request={
                start_time: new Time(start_time),
                end_time: new Time(end_time),
                start_id: start_id,//香草星空休閒農場
                destination_id: destination_id,//棲蘭森林遊樂區
                orderIndex: sort,//priority
                depthLimit: parseInt(""+depthLimit),
                //mustVisit_order:[{_id:destination_id,order:parseInt(""+depthLimit)}]//終點是已經決定好的
                nodeLimitNumber:30000
            }
            let constraint:constraint={
                considerWeekTime:true,
                considerReasonable:true,
                // considerMustNotVisit_order:true
                //considerMustVisit_order:true,
                // considerMustVist:true// 太久
                // considerMustNotVist:true

                // expect_heuristic:true,
                // non_heuristic:true,

                structure_minheap:true,
                comparator_heap:true,
                nodeLimit:true

                
                // structure_openlist:true,
                // comparator:true

                // comparator_heap_normalize_gaussian:true

                // km15:false
            }
            if( heuristic_gate == "true"){
                constraint.attraction_expect_heuristic = true;
                console.log("attraction expect_heuristic");
            }else{
                console.log("attraction non_heuristic");
            }

            if(km15_gate == "true"){
                constraint.km15=true
            }
            
            let astar: Astar = new Astar(request,constraint);
            //---for testing---
            let run_start: Date = new Date;
            let Result: Result = astar.search();
            let run_end: Date = new Date;                    
            POImap.clear();//very important, because it is static
            Vector.clear();
            Tool.datanmsg(`run time:${JSON.stringify(Time.millionToDetail(run_end.getTime() - run_start.getTime()))}`);
            Result.excutionTime = run_end.getTime() - run_start.getTime()//millionseconds
            callback(Result);

    }
}
