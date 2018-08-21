import Vector from '../algorithm/Vector';
import Node from '../algorithm/Node';
import POI from '../algorithm/POI';
import POImap from '../algorithm/POImap';
import PriorityQueue from '../algorithm/PriorityQueue';
import Astar from '../algorithm/Astar';
import { DB, pairData } from '../database/DB';
import Time from '../algorithm/Time';
import vzTaiwan from '../preprocess/vzTaiwan';
import { Result, detail, weekTime, dayTime, timeStatus, timeString, request, constraint } from '../algorithm/record';
import Tool from '../algorithm/Tool';


class exp1 {

    constructor() {
    }

    run(){
        this.data(()=>{
            for(let i:number=1;i<=1;i++){
                for(let depth:number=1;depth<=1;depth++){
                    let random:number=Tool.getRandomInt(0,POImap.pois.length-1);
                    // Tool.expmsg(`${random}`);
                    let start_id:string=POImap.pois[random]._id;
                    let destination_id:string=POImap.pois[Tool.getRandomIntWithout(0,POImap.pois.length-1,random)]._id;
                    let start_time:Time=new Time(undefined, 2017, 10, 30, 8, 0, 0);
                    let time_budget:number=11;
                    let orderIndex:Array<number>=[Node.index_attraction/*, Node.index_distance, Node.index_travelTime*/];
                    
                    let setting=this.setting(start_id,destination_id,start_time,time_budget,depth,orderIndex);
                    let request=setting[0];
                    let constraint=setting[1];
                    Tool.expmsg(`${depth}`);
                    this.excute(request,constraint);
                }
            }
        });
    }

    data(callback: () => void): void {
        DB.connectDB("poitest", (db) => {
            DB.select(db, `poi`, {}, {}, (db, items) => {
                let poi_num: number = 0;

                for (let poi of items) {
                    let weekTime: weekTime = vzTaiwan.weekday_textParsing(poi.open_time);
                    let now: POI = new POI(poi.name, poi.rating, poi._id/*, 0*/, poi.lat, poi.lng, poi.stay_time, weekTime);
                    POImap.insertPoi(now);
                    poi_num++;
                }
                Tool.actionmsg('get POIs from mongodb over');
                Tool.datanmsg(`number of poi:${poi_num}`);
                DB.select(db, `pairWise`, { from: 1, to: 1, distance: 1, travelTime: 1 }, {}, (db, items) => {
                    let pairWises_num: number = 0;
                    for (let pairWise of items) {
                        POImap.insertPairEdge(pairWise.from, pairWise.to, pairWise.distance, pairWise.travelTime);
                        pairWises_num++;
                    }
                    Tool.actionmsg('get pairWises from mongodb over');
                    Tool.datanmsg(`number of pairWise:${pairWises_num}`);
                    DB.closeDB(db);
                    callback();
                })
            })
        })

    }

    setting(start_id:string,destination_id:string,start_time:Time,time_budget:number,depth:number,orderIndex:Array<number>): Array<any> {
        let end_time:Time=start_time.add(time_budget,"hour");//variable
        let request: request = {
            start_time: start_time,
            end_time:  end_time,
            start_id: start_id,
            destination_id: destination_id,
            orderIndex: orderIndex,
            depthLimit: depth,
            mustVisit_order: [{ _id: destination_id, order: depth }]//終點是已經決定好的
        }
        let constraint: constraint = {
            considerWeekTime: true,
            considerMustVisit_order: true
        }
        return [request,constraint];
    }

    excute(request:request, constraint:constraint):void{
        let astar: Astar = new Astar(request, constraint);
        //---for testing---
        let run_start: Date = new Date;
        let Result: Result = astar.search();
        let run_end: Date = new Date;
        // POImap.clear();//very important, because it is static
        Vector.clear();
        Tool.expmsg(`path:${Result.pathString}`); 
        Tool.expmsg(`description:${Result.description}`);
        // Tool.expmsg(`run time:${JSON.stringify(Time.millionToDetail(run_end.getTime() - run_start.getTime()))}`);
        Result.excutionTime = run_end.getTime() - run_start.getTime();//millionseconds
    }
}

let exp=new exp1();
exp.run();
