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
const FindExp_1 = require("../operation/FindExp");
let router = express.Router();
router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const sess = req.session;
    let type = req.query.type;
    let dbName = req.query.dbName;
    let collName = req.query.collName;
    let index = req.query.index;
    let depth = req.query.depth;
    let sess_add = (req.query.sess_add == "true") ? true : false;
    if (sess_add) {
        sess.dbName.unshift(dbName);
        sess.collName.unshift(collName);
        sess.index.unshift(index);
        sess.depth.unshift(depth);
    }
    let exp;
    if (type == "1") {
        exp = yield FindExp_1.FindExp.find(dbName, collName, index, depth);
    }
    res.json({
        message: {
            exp: exp,
            sess: sess
        }
    });
    console.log("good job");
    res.end;
}));
exports.default = router;
