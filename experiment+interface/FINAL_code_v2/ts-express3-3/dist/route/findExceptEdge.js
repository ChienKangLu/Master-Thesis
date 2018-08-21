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
const FindEdges_1 = require("../operation/FindEdges");
const FindPoi_1 = require("../operation/FindPoi");
let router = express.Router();
router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let exceptEdgeDB = req.query.exceptEdgeDB;
    let exceptEdgeColl = req.query.exceptEdgeColl;
    let larger = req.query.larger;
    let smaller = req.query.smaller;
    let edges = yield FindEdges_1.FindEdges.find(exceptEdgeDB, exceptEdgeColl, parseInt(smaller), parseInt(larger));
    let pois = yield FindPoi_1.FindPoi.find({});
    let pois_id_key = {};
    for (let poi of pois) {
        pois_id_key[poi._id] = poi;
    }
    let poi_edge_data = [];
    for (let edge of edges) {
        let from_id = edge.from;
        let to_id = edge.to;
        poi_edge_data.push({
            from: {
                lat: pois_id_key[from_id].lat,
                lng: pois_id_key[from_id].lng
            },
            to: {
                lat: pois_id_key[to_id].lat,
                lng: pois_id_key[to_id].lng
            },
            except: edge.except
        });
    }
    console.log(`edge: ${poi_edge_data.length}`);
    res.json({
        message: poi_edge_data
    });
    console.log("good job");
    res.end;
}));
exports.default = router;
