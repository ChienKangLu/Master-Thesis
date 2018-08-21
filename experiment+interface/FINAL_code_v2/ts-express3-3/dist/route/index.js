"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const DB_1 = require("../database/DB");
const Tool_1 = require("../algorithm/Tool");
let router = express.Router();
router.get('/', (req, res, next) => {
    const sess = req.session;
    if (sess.dbName == null) {
        Tool_1.default.sysmsg(`ini session`);
        sess.dbName = [];
        sess.collName = [];
        sess.depth = [];
        sess.index = [];
    }
    let DBname = "finaldata";
    let collectName = "POI_all";
    ;
    let query = {};
    DB_1.DB.connectDB(DBname, (db) => {
        DB_1.DB.select(db, collectName, {}, query, (db, items) => {
            let pois = items;
            res.render(path.resolve(__dirname + '/../../views/index'), {
                pois: pois,
                sess: sess
            });
            res.end();
        });
    });
});
exports.default = router;
