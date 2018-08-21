import * as express from 'express';
import * as path from 'path';
import {FindVD} from '../operation/FindVD';
let router = express.Router();
router.get('/', async (req, res, next) => {
    let VD= await FindVD.find();
    res.json({
        message: VD
    });
    console.log("good job");
    res.end;
});

export default router;