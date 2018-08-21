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
const FindPair_1 = require("../operation/FindPair");
const FindPoi_1 = require("../operation/FindPoi");
let router = express.Router();
router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let type = req.query.type;
    let pair_from_id = req.query.pair_from_id;
    let pair_to_id = req.query.pair_to_id;
    let pair;
    let from_poi;
    let to_poi;
    if (type == "1") {
        pair = yield FindPair_1.FindPair.find(pair_from_id, pair_to_id);
        from_poi = yield FindPoi_1.FindPoi.findbyId(pair_from_id);
        to_poi = yield FindPoi_1.FindPoi.findbyId(pair_to_id);
    }
    res.json({
        message: {
            pair: pair,
            from_poi: from_poi,
            to_poi: to_poi
        }
    });
    console.log("good job");
    res.end;
}));
exports.default = router;
