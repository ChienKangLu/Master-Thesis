import * as express from 'express';
import * as path from 'path';
import {Test} from '../test/Test';
import Tool from '../algorithm/Tool';

let router = express.Router();
router.get('/', (req, res, next) => {
    //Test.ts
    let test =new Test();
    let data = test.run((Result)=>{
        res.header("Content-Type",'application/json');
        res.send(JSON.stringify(Result, null, 4));
        // res.json({
        //     message: Result
        // });
        Tool.sysmsg("router_test route over");
    });

});

export default router;