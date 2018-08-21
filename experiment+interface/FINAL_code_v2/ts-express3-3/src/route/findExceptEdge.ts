import * as express from 'express';
import * as path from 'path';
import {FindEdges} from '../operation/FindEdges';
import {FindPoi} from '../operation/FindPoi';
let router = express.Router();
router.get('/', async (req, res, next) => {
    let exceptEdgeDB:string=req.query.exceptEdgeDB;
    let exceptEdgeColl:string=req.query.exceptEdgeColl;
    let larger:string=req.query.larger;
    let smaller:string=req.query.smaller;
    let edges= await FindEdges.find(exceptEdgeDB,exceptEdgeColl, parseInt(smaller), parseInt(larger));

    
    let pois= await FindPoi.find({});
    let pois_id_key:any={};
    for(let poi of pois){
        pois_id_key[poi._id] = poi;
        // console.log(poi._id,poi.name);
    }
    let poi_edge_data:Array<any> = [];

    for(let edge of edges){
        let from_id = edge.from;
        let to_id = edge.to;
        poi_edge_data.push({
            from : {
                lat:pois_id_key[from_id].lat,
                lng:pois_id_key[from_id].lng
            },
            to : {
                lat:pois_id_key[to_id].lat,
                lng:pois_id_key[to_id].lng
            },
            except:edge.except
        });
    }

    console.log(`edge: ${poi_edge_data.length}`);
    res.json({
        message: poi_edge_data
    });
    console.log("good job");
    res.end;

});

export default router;