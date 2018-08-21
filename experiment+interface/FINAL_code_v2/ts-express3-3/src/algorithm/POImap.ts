import POI from '../algorithm/POI';
import { edgeDictionary, edge, edgeData } from '../algorithm/record';
import Time from '../algorithm/Time';
import { weekTime, dayTime, timeStatus, timeString, sorted_GlobalAttraction_data, time_poi_expectation, poi_expectation,depth_poi_fc,introductions} from '../algorithm/record';
import Tool from '../algorithm/Tool';
import HMM from '../algorithm/HMM';
import Astar from './Astar';
import Node from '../algorithm/Node';
import Expectation from '../algorithm/Expectation_new';//'../algorithm/Expectation'
import Vector from './Vector';
//checked 2018/1/10

class POImap {
    static pois: Array<POI> = [];
    static pairEdge: edgeDictionary = {};
    
    static maxGlobalAttraction: number = Number.MIN_VALUE;

    static fc_dict:depth_poi_fc = [];
        
    static insertPoi(poi: POI): void {
        POImap.pois.push(poi);
        if (poi.global_attraction > POImap.maxGlobalAttraction) {
            POImap.maxGlobalAttraction = poi.global_attraction;
        }
    }

    static insertPairEdge(from: string, to: string, distance: number, travelTime: number, lineDistance?:number ,lineTravelTime?:number,edgeExcept?:number) {
        if (POImap.pairEdge[from] == null) {
            
            let edge: edge = {};
            POImap.pairEdge[from] = edge;
        }
        let edgeData: edgeData = null
        if(edgeExcept==null)
            edgeData = { distance, travelTime,lineDistance,lineTravelTime};
        else
            edgeData = { distance, travelTime,lineDistance,lineTravelTime,edgeExcept};
        POImap.pairEdge[from][to] = edgeData;
    }
    static getPairEdgeDistance(from: POI, to: POI):number{
        let distance = POImap.pairEdge[from._id][to._id].distance;
        if(distance==null){// 因為距離大於15公里，沒有使用google查詢，使用直線距離，以及60公里行車速度
            distance = <number>POImap.pairEdge[from._id][to._id].lineDistance;
        }
        return distance;
    }
    static getPairEdgeTravelTime(from: POI, to: POI):number{
        let travelTime = POImap.pairEdge[from._id][to._id].travelTime;
        if(travelTime==null){// 因為距離大於15公里，沒有使用google查詢，使用直線距離，以及60公里行車速度
            travelTime = <number>POImap.pairEdge[from._id][to._id].lineTravelTime;
        }
        return travelTime;
    }
    static getPairEdgeExpect(from: POI, to: POI):number{//2018_5_17
        let edgeExcept = POImap.pairEdge[from._id][to._id].edgeExcept;//2018_5_17
        return edgeExcept;//2018_5_17
    }

    static printPairEdge(): void {
        let fromKeys = Object.keys(POImap.pairEdge);
        for (let from in POImap.pairEdge) {
            for (let to in POImap.pairEdge[from]) {
                let distance: number = POImap.pairEdge[from][to].distance;
                let travelTime: number = POImap.pairEdge[from][to].travelTime;
                console.log(`(${from},${to},${distance},${travelTime.toPrecision(2)})`);
            }
        }
    }
    static printPOIs(): string {
        let s: string = "";
        let index: number = 0;
        POImap.pois.forEach((element) => { s = s + `${index}:${element.toString()}`; index++ });
        return s;
    }

    static reverse(): void {
        POImap.pois.forEach((element) => {
            element.global_attraction_cost = POImap.maxGlobalAttraction - element.global_attraction;
        });
    }
    static set_realTimes(start_time: Time) {
        for (let poi of POImap.pois) {
            poi.set_realTime(start_time);
        }
    }

    static setUp(start_time: Time, depth_limit: number, start_id: string, destination_id: string,attr_unit_mean:Array<number>,attr_unit_sd:Array<number>,r:number): void {
        POImap.reverse();
        Tool.actionmsg(`After reverse`);
        Tool.datanmsg(`maxGlobalAttraction:${this.maxGlobalAttraction}`);
        POImap.set_realTimes(start_time);
        Tool.actionmsg(`Compute all week_time accroding to start_time`);

        if(Astar.constraint.attraction_expect_heuristic){
            let expectation:Expectation = new Expectation(POImap.pois.length,depth_limit,start_id, destination_id,attr_unit_mean,attr_unit_sd,r);
            POImap.fc_dict = expectation.fc_dict;
        }

        
    }

    static findFromPOImap(_id: string): POI | any {
        for (let poi of POImap.pois) {
            if (poi._id == _id) {
                return poi;
            }
        }
        return null;
    }
    static findFromPOImapByName(name: string): string | any{
        for (let poi of POImap.pois) {
            if (poi.name == name) {
                return poi._id;
            }
        }
        return null;
    }
    static clear(): void {

        POImap.pois = [];
        // POImap.pois.length = 0;
        POImap.pairEdge = {};
        // Tool.deleteProperties(POImap.pairEdge);
        POImap.maxGlobalAttraction = Number.MIN_VALUE;
        POImap.fc_dict = [];
        // POImap.fc_dict.length = 0

    }
    static toString(): string {
        return `number of poi:${POImap.pois.length}\nnumber of pairEdge:${Object.keys(POImap.pairEdge).length ** 2}`;
    }
    static printAllpoi(): void {
        for (let poi of POImap.pois) {
            console.log(`${JSON.stringify(poi.weekTime, null, 4)}`);
            let timeStatus: timeStatus = poi.weekTime[0][0];
            if (timeStatus.open != null) {
                if (timeStatus.open.time != null)
                    console.log(`${timeStatus.open.time.toString()}`)
            }
        }
    }
    static user_specify(index:number,x:number,mean:number,sd:number){
        let normal = POImap.normal(x,mean,sd);//有正負號，多少個標準差
        // if(index == Node.index_distance)
        //     if(normal<-2||normal>2)
        //         return 1;
        return POImap.sigmoid_function(normal,0.5);//0~1

    }
    static normal(x:number,mean:number,sd:number):number{
        return (x-mean)/sd;
    }
    static sigmoid_function(x:number,alpha:number):number{
        let value:number = 1/(1+Math.exp(-alpha*x));
        if(isNaN(value)){
            console.log(`POImap got a NAN!!Check now:${x},${alpha}`);
        }
        return value;
    }
}
export default POImap;