"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
let router = express.Router();
router.get('/', (req, res, next) => {
    res.render(path.resolve(__dirname + '/../../views/lineSliderTest'), {});
    res.end();
});
exports.default = router;
