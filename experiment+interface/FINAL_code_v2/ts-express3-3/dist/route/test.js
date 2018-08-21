"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
let router = express.Router();
router.get('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
        message: {
            id: req.session.id,
            rr: req.session.rr
        }
    });
    console.log("good job");
    res.end;
});
exports.default = router;
