"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Test_HMM_1 = require("../test/Test_HMM");
const Tool_1 = require("../algorithm/Tool");
let router = express.Router();
router.get('/', (req, res, next) => {
    let test = new Test_HMM_1.Test_HMM();
    let data = test.run(() => {
        res.json({
            message: "router_test_hmm over"
        });
        Tool_1.default.sysmsg("router_test_hmm over");
    });
});
exports.default = router;
