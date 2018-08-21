"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const MinHeap_basic_1 = require("../algorithm/MinHeap_basic");
let router = express.Router();
router.get('/', (req, res, next) => {
    let minHeap2 = new MinHeap_basic_1.default();
    minHeap2.insert(4);
    minHeap2.insert(2);
    minHeap2.insert(1);
    minHeap2.insert(5);
    minHeap2.insert(9);
    minHeap2.insert(8);
    minHeap2.insert(7);
    minHeap2.insert(6);
    minHeap2.insert(11);
    minHeap2.insert(15);
    minHeap2.insert(-10);
    minHeap2.insert(8);
    console.log(minHeap2.toString());
    minHeap2.popMin();
    console.log(minHeap2.toString());
    minHeap2.popMin();
    console.log(minHeap2.toString());
    minHeap2.popMin();
    console.log(minHeap2.toString());
    minHeap2.popMin();
    console.log(minHeap2.toString());
    res.json({
        message: "route_test_heap over"
    });
});
exports.default = router;
