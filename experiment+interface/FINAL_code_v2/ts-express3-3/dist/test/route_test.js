"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Test_1 = require("../test/Test");
const Tool_1 = require("../algorithm/Tool");
let router = express.Router();
router.get('/', (req, res, next) => {
    let test = new Test_1.Test();
    let data = test.run((Result) => {
        res.header("Content-Type", 'application/json');
        res.send(JSON.stringify(Result, null, 4));
        Tool_1.default.sysmsg("router_test route over");
    });
});
exports.default = router;
