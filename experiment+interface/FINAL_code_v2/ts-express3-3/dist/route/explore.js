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
const FindGeometry_1 = require("../operation/FindGeometry");
const FindPoi_1 = require("../operation/FindPoi");
let router = express.Router();
router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let start_id = req.query.start_id;
    let destination_id = req.query.destination_id;
    let notInIds = req.query.notInIds;
    console.log("notInIds", notInIds);
    if (notInIds == undefined) {
        notInIds = [];
    }
    let start_poi = yield FindPoi_1.FindPoi.findbyId(start_id);
    let destination_poi = yield FindPoi_1.FindPoi.findbyId(destination_id);
    let lat = (start_poi[0].lat + destination_poi[0].lat) / 2;
    let lng = (start_poi[0].lng + destination_poi[0].lng) / 2;
    console.log("center:", lng, ",", lat);
    let maxDistance = parseFloat(req.query.maxDistance);
    let pois = yield FindGeometry_1.FindGeometry.nearSphere(lng, lat, maxDistance, notInIds);
    res.json({
        message: pois
    });
    console.log("good job");
    res.end;
}));
exports.default = router;
