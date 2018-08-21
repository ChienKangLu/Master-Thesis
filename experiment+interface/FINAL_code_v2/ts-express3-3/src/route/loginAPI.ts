/**
 * https://stackoverflow.com/questions/2870371/why-is-jquerys-ajax-method-not-sending-my-session-cookie
 * 最重要!!https://stackoverflow.com/questions/34324460/express-session-not-saving-nodejs
 * 在ajax中要加上：
 *             xhrFields: {
                withCredentials: true
            },
    在server端要加上：
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

 * https://github.com/expressjs/session
 * https://ithelp.ithome.com.tw/articles/10187464
 */
import * as express from 'express';
import {FindUser} from '../operation/FindUser';
import {userSession} from '../algorithm/record';
interface userClientData{
    login:boolean,
    name:string
}
let router = express.Router();
router.post('/post', async (req, res, next) => {
    // // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', 'true');

    const sess:userSession = req.session as userSession; // 取得該連線存放在server端的session
    // console.log(sess.rr);
    // console.log(sess.id);
    // console.log(req.body);
    let account =req.body.account;
    let password =req.body.password;
    // console.log(account,password);
    if(account == "" || account == ""){
        //沒有輸入帳號或密碼
        sess.login = false;
        console.log("沒有輸入帳號或密碼");
        return res.redirect('/loginAPI');
    }else if (sess.login){
        //已經登入
        console.log("已經登入過");
        return res.redirect('/loginAPI');
    }else{
        //沒有登入過，查詢資料庫看帳號密碼對不對
        console.log("沒有登入過，查詢資料庫看帳號密碼對不對");
        let user = await FindUser.find({
            account:account,
            password:password
        });
        if(user.length==1){
            sess.login = true;
            sess._id = user[0]._id;
            sess.name = user[0].name;
            console.log("登入成功");
        }else{
            console.log("登入失敗");
        }
        return res.redirect('/loginAPI');
    }
});
router.get('/',  (req, res, next) => {
    // // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', 'true');

    const sess:userSession = req.session as userSession; // 取得該連線存放在server端的session
    console.log(sess);
    let userClientData:userClientData = {
        login:false,
        name:"訪客"
    }
    console.log(sess.login,sess.login);
    if(sess.login){
        userClientData.login = sess.login;
        userClientData.name = sess.name;
    }
    res.json({
        message: {
            userClientData:userClientData
        }
    });
    console.log("good job");
    res.end;
    
});
router.get('/logout',(req, res, next) => {
    const sess:userSession = req.session as userSession; // 取得該連線存放在server端的session
    sess.destroy(()=>{
        res.redirect('/loginAPI');
    });
})
export default router;