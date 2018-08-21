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
const SaveRoute_1 = require("../operation/SaveRoute");
let router = express.Router();
router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const sess = req.session;
    let Result = req.query.Result;
    let pathName = req.query.pathName;
    let _id = sess._id;
    yield SaveRoute_1.SaveRoute.save(_id, {
        pathName: pathName,
        Result: JSON.parse(Result)
    });
    res.json({
        message: {
            type: "儲存成功",
            pathName: pathName,
            _id: _id
        }
    });
    console.log("good job");
    res.end;
}));
exports.default = router;
