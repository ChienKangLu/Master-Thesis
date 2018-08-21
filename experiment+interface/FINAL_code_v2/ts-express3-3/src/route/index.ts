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
  // if (sess.views) {
  //   sess.views++;
  //   console.log("add views");
  // } else {
  //   sess.views = 1;
  //   console.log(`ini views: ${sess.views}`);
  // }

  let DBname: string  = "finaldata";//poitest/finaldata
  let collectName: string = "POI_all";;//poi/POI_all
  let query:any={};//{city:{$in:["臺北市","宜蘭縣"]},type:{$in:["view","stay"]}};
  DB.connectDB(DBname, (db) => {
    DB.select(db, collectName, {},query, (db, items) => {
      let pois=items;
      /*
        // console.log(items);
        // DB.aggregate(db, collectName,"city",(db,items)=>{
        //   let cities=items;
        //   console.log("city");
        //   console.log(items);
        //   DB.aggregate(db, collectName,"type",(db,items)=>{
        //     let types=items;
        //     console.log("type");
        //     console.log(items);
        //     DB.aggregate(db, collectName,"class",(db,items)=>{
        //       let classes=items;
        //       console.log("class");
        //       console.log(items);
      */
            res.render(path.resolve(__dirname + '/../../views/index'), { 
              pois: pois,
              sess:sess
              /*
                //,
                // cities:cities,
                // types:types,
                // classes:classes*/
            });
            res.end();
          });
          /*
              //     });
              //   });
              // });
    */
  });
/*
    //  res.sendFile(path.resolve(__dirname+'/../../views/index.html'));
    /*
    res.send(
        `<html>
          <head>
            <title>Tutorial: HelloWorld</title>
          </head>
          <body>
            <h1>HelloWorld Tutorial</h1>
    
        <p>
          The current data and time is: 
          <strong>`+ new Date() + `</strong>
        </p>    
    
          </body>
        </html>`
    );
    */
    /*
    res.json({
        message: 'Hello World!'
    });
  */
  
});
export default router;
