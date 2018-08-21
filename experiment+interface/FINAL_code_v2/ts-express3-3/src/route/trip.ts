import * as express from 'express';
import * as path from 'path';
import {Trip} from '../operation/Trip';
import {Filter} from '../operation/Filter';

let router = express.Router();

router.get('/', (req, res, next) => {
    //Trip.ts
    //過濾完獲得POIs以及PairWises
    // let query:any={city:{$in:["臺北市","宜蘭縣"]},type:{$in:["view","stay"]}};
    let query:any=req.query.query;
    Filter.run(query,(filterData)=>{
        //搜尋路線
        let POIs=filterData.POIs;
        let PairWises=filterData.PairWises;
        let startPOI=req.query.start_id;
        let endPOI=req.query.destination_id;
        let startTime=req.query.start_time;
        let endTime=req.query.end_time;
        let sort=req.query.sort;
        let depthLimit=req.query.depthLimit;
        let heuristic_gate = req.query.heuristic_gate;
        let km15_gate = req.query.km15_gate;
        console.log("trip.ts");
        let data = Trip.getPath(POIs,PairWises,startPOI,endPOI,startTime,
        endTime,sort,depthLimit,heuristic_gate ,km15_gate,(Result)=>{
            res.json({
                message: Result
            });
            console.log("good job");
            res.end;
        });
    })

});

export default router;