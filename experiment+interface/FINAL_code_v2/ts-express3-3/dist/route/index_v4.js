"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const DB_1 = require("../database/DB");
let router = express.Router();
router.get('/', (req, res, next) => {
    const sess = req.session;
    if (sess.login == null)
        sess.login = false;
    let DBname = "finaldata";
    let collectName = "POI_all";
    ;
    let query = {};
    DB_1.DB.connectDB(DBname, (db) => {
        DB_1.DB.select(db, collectName, {}, query, (db, items) => {
            let pois = items;
            res.render(path.resolve(__dirname + '/../../views/index_v4'), {
                pois: pois,
                sess: sess
            });
            res.end();
        });
    });
});
exports.default = router;
