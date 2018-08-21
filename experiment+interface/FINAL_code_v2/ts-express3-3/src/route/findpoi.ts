import * as express from 'express';
import * as path from 'path';
import {FindPoi} from '../operation/FindPoi';
let router = express.Router();
router.get('/', async (req, res, next) => {
    let type:string=req.query.type;
    let pois;
    if(type=="1"){
        let query_str:any=req.query.query_str;
        // let str = `{"name":"南方澳觀景台"}`;
        pois= await FindPoi.find(JSON.parse(query_str));
    }else if(type=="2"){
        let _id:any=req.query._id;
        pois= await FindPoi.findbyId(_id);
    }
    res.json({
        message: pois
    });
    console.log("good job");
    res.end;

});

export default router;