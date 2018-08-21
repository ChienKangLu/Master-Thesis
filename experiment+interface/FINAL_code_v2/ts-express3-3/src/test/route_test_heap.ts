import * as express from 'express';
import * as path from 'path';
import Tool from '../algorithm/Tool';

import MinHeap from '../algorithm/MinHeap_basic';
let router = express.Router();
router.get('/', (req, res, next) => {
    // let minHeap:MinHeap=new MinHeap();
    // minHeap.data=[0,3,102,100,5,4,3,2,1,99];
    // console.log(minHeap.data.pop());
    // let size=minHeap.data.length-1;
    // minHeap.size= size;
    // minHeap.buildMinHeap();
    // console.log(minHeap.toString());
    // for(let i=0;i<size;i++){
    //     let min=minHeap.popMin();
    //     console.log(min);
    //     console.log(minHeap.toString());
    // }
    // console.log(minHeap.isHeapEmpity());


    let minHeap2:MinHeap=new MinHeap();
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

export default router;