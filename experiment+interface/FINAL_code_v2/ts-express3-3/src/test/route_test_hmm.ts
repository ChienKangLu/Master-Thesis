import * as express from 'express';
import * as path from 'path';
import {Test_HMM} from '../test/Test_HMM';
import Tool from '../algorithm/Tool';

let router = express.Router();
router.get('/', (req, res, next) => {
    //Test.ts
    let test =new Test_HMM();
    let data = test.run(()=>{
        res.json({
            message: "router_test_hmm over"
        });
        Tool.sysmsg("router_test_hmm over");
    });

});

export default router;