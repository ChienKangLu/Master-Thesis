import * as express from 'express';
import * as path from 'path';
import {FindGeometry} from '../operation/FindGeometry';
import {FindPoi} from '../operation/FindPoi';
let router = express.Router();
router.get('/', async (req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    let coordinates_string:any = req.query.coordinates;
    console.log("findAreaPOIs server side",coordinates_string);
    let coordinates:any = [];
    for(let i =0;i<coordinates_string.length;i++){
        coordinates[i]=[];
        coordinates[i][0]=parseFloat(coordinates_string[i][0]);
        coordinates[i][1]=parseFloat(coordinates_string[i][1]);
    }
    console.log(coordinates);
    let pois= await FindGeometry.polygon(coordinates);

    res.json({
        message: pois
    });
    console.log("good job");
    res.end;

});

export default router;