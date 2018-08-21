import * as express from 'express';
import * as path from 'path';
import {FindPair} from '../operation/FindPair';
import {FindPoi} from '../operation/FindPoi';
let router = express.Router();
router.get('/', async (req, res, next) => {
    let type:string=req.query.type;
    let pair_from_id:string = req.query.pair_from_id;
    let pair_to_id:string = req.query.pair_to_id;
    let pair;
    let from_poi;
    let to_poi;
    if(type=="1"){
        pair= await FindPair.find(pair_from_id,pair_to_id);
        from_poi= await FindPoi.findbyId(pair_from_id);
        to_poi= await FindPoi.findbyId(pair_to_id);
    }
    res.json({
        message: {
            pair: pair,
            from_poi: from_poi,
            to_poi: to_poi
        }
    });
    console.log("good job");
    res.end;

});

export default router;