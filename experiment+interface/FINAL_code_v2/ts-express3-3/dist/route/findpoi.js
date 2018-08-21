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
const FindPoi_1 = require("../operation/FindPoi");
let router = express.Router();
router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let type = req.query.type;
    let pois;
    if (type == "1") {
        let query_str = req.query.query_str;
        pois = yield FindPoi_1.FindPoi.find(JSON.parse(query_str));
    }
    else if (type == "2") {
        let _id = req.query._id;
        pois = yield FindPoi_1.FindPoi.findbyId(_id);
    }
    res.json({
        message: pois
    });
    console.log("good job");
    res.end;
}));
exports.default = router;
