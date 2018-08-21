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
let router = express.Router();
router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let coordinates_string = req.query.coordinates;
    console.log("findAreaPOIs server side", coordinates_string);
    let coordinates = [];
    for (let i = 0; i < coordinates_string.length; i++) {
        coordinates[i] = [];
        coordinates[i][0] = parseFloat(coordinates_string[i][0]);
        coordinates[i][1] = parseFloat(coordinates_string[i][1]);
    }
    console.log(coordinates);
    let pois = yield FindGeometry_1.FindGeometry.polygon(coordinates);
    res.json({
        message: pois
    });
    console.log("good job");
    res.end;
}));
exports.default = router;
