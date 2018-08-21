import * as express from 'express';
import {userSession} from '../algorithm/record';
import {SaveRoute} from '../operation/SaveRoute';
let router = express.Router();
router.get('/', async (req, res, next) => {
    const sess:userSession = req.session as userSession; // 取得該連線存放在server端的session
    let Result:string=req.query.Result;//This is a JSON string
    let pathName:string=req.query.pathName;
    let _id:string = sess._id;
    await SaveRoute.save(_id,{
        pathName:pathName,
        Result:JSON.parse(Result)
    });

    res.json({
        message: {
            type:"儲存成功",
            pathName:pathName,
            _id:_id
        }
    });
    console.log("good job");
    res.end;

});

export default router;