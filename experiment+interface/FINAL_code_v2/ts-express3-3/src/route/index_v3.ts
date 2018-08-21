import * as express from 'express';
import * as path from 'path';
import { DB } from '../database/DB';
import {MySession} from '../algorithm/record';
import Tool from '../algorithm/Tool';

let router = express.Router();

router.get('/', (req, res, next) => {
  const sess:MySession = req.session as MySession;
  if(sess.dbName ==null){
    Tool.sysmsg(`ini session`);
    sess.dbName=[];
    sess.collName=[];
    sess.depth=[];
    sess.index=[];
  }
  let DBname: string  = "finaldata";//poitest/finaldata
  let collectName: string = "POI_all";;//poi/POI_all
  let query:any={};//{city:{$in:["臺北市","宜蘭縣"]},type:{$in:["view","stay"]}};
  DB.connectDB(DBname, (db) => {
    DB.select(db, collectName, {},query, (db, items) => {
      let pois=items;
            res.render(path.resolve(__dirname + '/../../views/index_v3'), { 
              pois: pois,
              sess:sess
            });
            res.end();
          });
  });
});
export default router;
