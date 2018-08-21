import * as express from 'express';
import {userSession} from '../algorithm/record';
import {FindUser} from '../operation/FindUser';
let router = express.Router();
router.get('/', async (req, res, next) => {
    const sess:userSession = req.session as userSession; // 取得該連線存放在server端的sessions
    let _id:string = sess._id;
    let user = await FindUser.findbyId(_id);
    res.json({
        message: {
            results:user[0].results
        }
    });
    console.log("good job");
    res.end;

});

export default router;