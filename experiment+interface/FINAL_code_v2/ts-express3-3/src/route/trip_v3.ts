import * as express from 'express';
import * as path from 'path';
import {Trip} from '../operation/Trip';
import {Filter} from '../operation/Filter';
import { Trip_v3 } from '../operation/Trip_v3';
import {visit_order} from '../algorithm/record';

let router = express.Router();

router.get('/', (req, res, next) => {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
        //搜尋路線
        let start_id=req.query.start_id;
        let destination_id=req.query.destination_id;
        let start_time=req.query.start_time;
        let end_time=req.query.end_time;
        let depth=req.query.depth;
        let s_attr=req.query.s_attr;
        let s_dis=req.query.s_dis;
        let s_travel=req.query.s_travel;

        let considerMustVisit_order:boolean =  false;
        let considerMustNotVist:boolean = false;
        //considerMustVisit_order 和 considerMustNotVist 是true才會有陣列傳入
        let mustVisit_order:Array<visit_order> = req.query.mustVisit_order;
        let mustNotVist:Array<string>  = req.query.mustNotVist;

        if( req.query.considerMustVisit_order=="true"){
            considerMustVisit_order=true;
        }
        if(req.query.considerMustNotVist == "true"){
            considerMustNotVist=true;
        }
        console.log("considerMustVisit_order",considerMustVisit_order,typeof(considerMustVisit_order));
        console.log("considerMustVisit_order",considerMustNotVist,typeof(considerMustNotVist));
        
        let trip_v3 = new Trip_v3(start_id,destination_id,start_time,end_time,depth,s_attr,s_dis,s_travel,considerMustVisit_order,considerMustNotVist,mustVisit_order,mustNotVist,(Result)=>{
            res.json({
                message: Result
            });
            console.log("good job");
            res.end;
        });
        trip_v3.run();
        // res.json({
        //     message: "Result hahahahhahha"
        // });
        // console.log("good job");
        // res.end;
});

export default router;