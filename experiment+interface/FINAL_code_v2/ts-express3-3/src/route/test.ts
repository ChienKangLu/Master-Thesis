import * as express from 'express';
import * as path from 'path';
import { DB } from '../database/DB';
import {userSession,MySession} from '../algorithm/record';
import Tool from '../algorithm/Tool';

let router = express.Router();

router.get('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    message: {
      id:req.session.id,
      rr:req.session.rr
    }
});
console.log("good job");
res.end;
 
});
export default router;
