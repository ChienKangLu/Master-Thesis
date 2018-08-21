import * as express from 'express';
import * as path from 'path';
import {FindExp} from '../operation/FindExp';
import {MySession} from '../algorithm/record';

let router = express.Router();
router.get('/', async (req, res, next) => {
    const sess:MySession = req.session as MySession;

    let type:string=req.query.type;
    let dbName:string = req.query.dbName;
    let collName:string = req.query.collName;
    let index:number = req.query.index;
    let depth:number = req.query.depth;
    let sess_add:boolean = (req.query.sess_add=="true")?true:false;
    if(sess_add){
        sess.dbName.unshift(dbName);
        sess.collName.unshift(collName);
        sess.index.unshift(index);
        sess.depth.unshift(depth);
    }

    let exp;
    if(type=="1"){
        exp= await FindExp.find(dbName,collName,index,depth);
    }
    res.json({
        message: {
            exp:exp,
            sess:sess
        }
    });
    console.log("good job");
    res.end;
});

export default router;