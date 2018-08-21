import Vector from '../algorithm/Vector';
import Node from '../algorithm/Node';
import POI from '../algorithm/POI';
import POImap from '../algorithm/POImap';
import PriorityQueue from '../algorithm/PriorityQueue';
import Astar from '../algorithm/Astar';
import {DB,pairData} from '../database/DB';
import Time from '../algorithm/Time';
import {Result,detail} from '../algorithm/record';
import vzTaiwan from '../preprocess/vzTaiwan';
import {weekTime,dayTime,timeStatus,timeString,request,constraint} from '../algorithm/record';
import Tool from '../algorithm/Tool';
import HMM from '../algorithm/HMM';

export class Test_HMM{
    constructor(){
    }
    run(callback: () => void): void {
        DB.connectDB("poitest",(db) => {
            DB.select(db, `poi`, {},{}, (db, items) => {
                let poi_num: number = 0;
                
                for (let poi of items) {
                    let weekTime: weekTime = vzTaiwan.weekday_textParsing(poi.open_time);
                    let now: POI = new POI(poi.name, poi.rating, poi._id/*, 0*/, poi.lat, poi.lng, poi.stay_time, weekTime);
                    POImap.insertPoi(now);
                    poi_num++;
                }
                Tool.actionmsg('get POIs from mongodb over');
                Tool.datanmsg(`number of poi:${poi_num}`);
                DB.select(db, `pairWise`, { from: 1, to: 1, distance: 1, travelTime: 1 }, {},(db, items) => {
                    let pairWises_num: number = 0;
                    for (let pairWise of items) {
                        POImap.insertPairEdge(pairWise.from, pairWise.to, pairWise.distance, pairWise.travelTime);
                        pairWises_num++;
                    }
                    Tool.actionmsg('get pairWises from mongodb over');
                    Tool.datanmsg(`number of pairWise:${pairWises_num}`);
                    DB.closeDB(db);


                    POImap.reverse();
                    // POImap.statistic();
                    // let sd_distance=POImap.sd_Distance;
                    let N=POImap.pois.length;//city
                    let T=3;//depth limit
                    let A:Array<Array<number>>=[];//distance probability
                    let score:Array<number>=[];

                    let from_idx=0;
                    for(let from in POImap.pairEdge){
                        A[from_idx]=[];
                        let to_idx=0;
                        for(let to in POImap.pairEdge[from]){
                            let distance:number=POImap.pairEdge[from][to].distance;
                            let travelTime:number=POImap.pairEdge[from][to].travelTime;
                            let d:number=distance;
                            // A[from_idx][to_idx]=Math.exp(-Math.pow(d/sd_distance,2));
                            A[from_idx][to_idx]=d;
                            to_idx++;
                        }
                        from_idx++;
                    }
                    Tool.actionmsg(`Compute A by distance for HMM`);
                    //normalize every row, becasue sum of probability need to be 1
                    for(let i=0;i<N;i++){
                        let sum=0;
                        for(let j=0;j<N;j++){
                            sum+=A[i][j];
                        }
                        for(let j=0;j<N;j++){
                            A[i][j]=A[i][j]/sum;
                        }
                    }
                    Tool.actionmsg(`Normaline A for HMM`);
                    // let sum_probability=0;
                    // for(let i=0;i<N;i++){
                    //     sum_probability+=A[0][i];
                    // }
                    // console.log(sum_probability);
                    
                    //check the two index(pois,pairEdge) is the same order
                    //create id dictionary
                    let go:boolean=true;
                    let id_dictionary=[];
                    if(go){
                        let idx=0;
                        for(let from in POImap.pairEdge){
                            console.log(`${from},${POImap.pois[idx]._id},${from==POImap.pois[idx]._id}`);
                            id_dictionary[idx]=POImap.pois[idx]._id;
                            idx++;
                        }
                    }

                    for(let i=0;i<N;i++){
                        score[i]=POImap.pois[i].global_attraction_cost;
                        console.log(`${i}:${POImap.pois[i].name},${POImap.pois[i].global_attraction_cost}`)
                    }
                    Tool.actionmsg(`Compute score for HMM`);

                    let hmm:HMM=new HMM(N,T,A,score);          
                    let beta=hmm.back_expectation(0,3);
                    
                    Tool.actionmsg(`Finsih back_expectation for HMM`);
                    //加入Astar
                    //how to index!....
                    //beta->key value
                    //ex: beta[3]["38018374d01ks0ke"]
                    //2017-12-23 16:31 
                    // console.log(JSON.stringify(beta[depth][state],null,4));
                    // console.log(JSON.stringify(beta,null,4));

                    //transfer to number-string->number pair
                    //ex: time_city_expectation[1]["59cde0b1d63dcb07700d1c2c"]
                    let time_city_expectation=[];
                    for(let t=0;t<T;t++){
                        let map:{ [key: string]: number }={};
                        for(let n=0;n<N;n++){
                            map[id_dictionary[n]]=beta[t][n];
                        }
                        time_city_expectation[t]=map;
                    }
                    console.log(JSON.stringify(time_city_expectation,null,4));
                    
                    Tool.actionmsg(`Transfer beta structure to time-city_id-expectaion`);
                    callback();
                });
            });
        });
    }
}
