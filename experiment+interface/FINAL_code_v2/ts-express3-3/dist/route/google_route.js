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
const https = require("https");
let polyUtil = require('polyline-encoded');
let router = express.Router();
router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let origin = req.query.origin;
    let destination = req.query.destination;
    let waypoints = req.query.waypoints;
    let API_KEY = "AIzaSyBVp3HY509JeYQRkHidsYOgRdNzcqJij8c";
    let http_str = `https://maps.googleapis.com/maps/api/directions/json?`;
    http_str += `origin=${origin}&`;
    http_str += `destination=${destination}&`;
    http_str += `waypoints=${waypoints}&`;
    http_str += `key=${API_KEY}`;
    https.get(http_str, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            let encoded = JSON.parse(data).routes[0].overview_polyline.points;
            var latlngs = polyUtil.decode(encoded);
            console.log(`google_route.ts:get a lot of latlngs`);
            res.json({
                message: latlngs
            });
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    console.log("good job");
    res.end;
}));
exports.default = router;
