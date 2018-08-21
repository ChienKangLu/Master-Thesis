import * as express from 'express';
import * as path from 'path';
import {FindGeometry} from '../operation/FindGeometry';
import {FindPoi} from '../operation/FindPoi';
let router = express.Router();
router.get('/', async (req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    let start_id:string = req.query.start_id;
    let destination_id:string = req.query.destination_id;
    let notInIds:Array<string> =  req.query.notInIds;
    console.log("notInIds",notInIds);
    if(notInIds==undefined){
        notInIds=[];
    }
    let start_poi:any = await FindPoi.findbyId(start_id);
    let destination_poi:any  = await FindPoi.findbyId(destination_id);

    let lat:number= (start_poi[0].lat + destination_poi[0].lat)/2;
    let lng:number= (start_poi[0].lng + destination_poi[0].lng)/2;
    console.log("center:",lng,",",lat);
    let maxDistance:number = parseFloat(req.query.maxDistance);
    let pois= await FindGeometry.nearSphere(lng,lat,maxDistance,notInIds);

    res.json({
        message: pois
    });
    console.log("good job");
    res.end;

});

export default router;