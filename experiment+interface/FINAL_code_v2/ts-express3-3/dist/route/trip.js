"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Trip_1 = require("../operation/Trip");
const Filter_1 = require("../operation/Filter");
let router = express.Router();
router.get('/', (req, res, next) => {
    let query = req.query.query;
    Filter_1.Filter.run(query, (filterData) => {
        let POIs = filterData.POIs;
        let PairWises = filterData.PairWises;
        let startPOI = req.query.start_id;
        let endPOI = req.query.destination_id;
        let startTime = req.query.start_time;
        let endTime = req.query.end_time;
        let sort = req.query.sort;
        let depthLimit = req.query.depthLimit;
        let heuristic_gate = req.query.heuristic_gate;
        let km15_gate = req.query.km15_gate;
        console.log("trip.ts");
        let data = Trip_1.Trip.getPath(POIs, PairWises, startPOI, endPOI, startTime, endTime, sort, depthLimit, heuristic_gate, km15_gate, (Result) => {
            res.json({
                message: Result
            });
            console.log("good job");
            res.end;
        });
    });
});
exports.default = router;
