"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const FindUser_1 = require("../operation/FindUser");
let router = express.Router();
router.post('/post', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const sess = req.session;
    let account = req.body.account;
    let password = req.body.password;
    if (account == "" || account == "") {
        sess.login = false;
        console.log("沒有輸入帳號或密碼");
        return res.redirect('/loginAPI');
    }
    else if (sess.login) {
        console.log("已經登入過");
        return res.redirect('/loginAPI');
    }
    else {
        console.log("沒有登入過，查詢資料庫看帳號密碼對不對");
        let user = yield FindUser_1.FindUser.find({
            account: account,
            password: password
        });
        if (user.length == 1) {
            sess.login = true;
            sess._id = user[0]._id;
            sess.name = user[0].name;
            console.log("登入成功");
        }
        else {
            console.log("登入失敗");
        }
        return res.redirect('/loginAPI');
    }
}));
router.get('/', (req, res, next) => {
    const sess = req.session;
    console.log(sess);
    let userClientData = {
        login: false,
        name: "訪客"
    };
    console.log(sess.login, sess.login);
    if (sess.login) {
        userClientData.login = sess.login;
        userClientData.name = sess.name;
    }
    res.json({
        message: {
            userClientData: userClientData
        }
    });
    console.log("good job");
    res.end;
});
router.get('/logout', (req, res, next) => {
    const sess = req.session;
    sess.destroy(() => {
        res.redirect('/loginAPI');
    });
});
exports.default = router;
