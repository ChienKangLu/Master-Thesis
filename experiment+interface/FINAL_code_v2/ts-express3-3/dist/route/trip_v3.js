"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Trip_v3_1 = require("../operation/Trip_v3");
let router = express.Router();
router.get('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let start_id = req.query.start_id;
    let destination_id = req.query.destination_id;
    let start_time = req.query.start_time;
    let end_time = req.query.end_time;
    let depth = req.query.depth;
    let s_attr = req.query.s_attr;
    let s_dis = req.query.s_dis;
    let s_travel = req.query.s_travel;
    let considerMustVisit_order = false;
    let considerMustNotVist = false;
    let mustVisit_order = req.query.mustVisit_order;
    let mustNotVist = req.query.mustNotVist;
    if (req.query.considerMustVisit_order == "true") {
        considerMustVisit_order = true;
    }
    if (req.query.considerMustNotVist == "true") {
        considerMustNotVist = true;
    }
    console.log("considerMustVisit_order", considerMustVisit_order, typeof (considerMustVisit_order));
    console.log("considerMustVisit_order", considerMustNotVist, typeof (considerMustNotVist));
    let trip_v3 = new Trip_v3_1.Trip_v3(start_id, destination_id, start_time, end_time, depth, s_attr, s_dis, s_travel, considerMustVisit_order, considerMustNotVist, mustVisit_order, mustNotVist, (Result) => {
        res.json({
            message: Result
        });
        console.log("good job");
        res.end;
    });
    trip_v3.run();
});
exports.default = router;
