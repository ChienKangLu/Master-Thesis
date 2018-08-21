"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("../algorithm/Node");
const Vector_1 = require("../algorithm/Vector");
const Astar_1 = require("../algorithm/Astar");
class MinHeap {
    constructor() {
        this.data = [new Node_1.default()];
        this.size = 0;
        MinHeap.reset();
        if (Astar_1.default.constraint.comparator_heap_normalize_gaussian ||
            Astar_1.default.constraint.comparater_heap_sigmoid ||
            Astar_1.default.constraint.comparater_heap_normal_sigmoid) {
        }
    }
    setComparator(comparator) {
        this.comparator = comparator;
    }
    static reset() {
        MinHeap.sum = new Vector_1.default;
        MinHeap.x_2 = new Vector_1.default;
        MinHeap.mean = new Vector_1.default;
        MinHeap.variance = new Vector_1.default;
    }
    add(element) {
        this.data.push(element);
        this.size++;
        if (Astar_1.default.constraint.comparator_heap_normalize_gaussian ||
            Astar_1.default.constraint.comparater_heap_sigmoid ||
            Astar_1.default.constraint.comparater_heap_normal_sigmoid) {
            this.sum_add(element);
            this.x_2_add(element);
            this.mean();
            this.variance();
        }
        this.shipUp();
    }
    pop() {
        if (!this.isEmpty) {
            return null;
        }
        let min = this.minimum();
        this.data[1] = this.data[this.size];
        this.data.pop();
        this.size--;
        if (Astar_1.default.constraint.comparator_heap_normalize_gaussian ||
            Astar_1.default.constraint.comparater_heap_sigmoid ||
            Astar_1.default.constraint.comparater_heap_normal_sigmoid) {
            this.sum_minus(min);
            this.x_2_minus(min);
            this.mean();
            this.variance();
        }
        this.minHeapify(1);
        return min;
    }
    sum_add(element) {
        MinHeap.sum = MinHeap.sum.add(element.f);
    }
    sum_minus(element) {
        MinHeap.sum = MinHeap.sum.minus(element.f);
    }
    x_2_add(element) {
        MinHeap.x_2 = MinHeap.x_2.add(element.f.pow(2));
    }
    x_2_minus(element) {
        MinHeap.sum = MinHeap.sum.minus(element.f.pow(2));
    }
    mean() {
        MinHeap.mean = MinHeap.sum.divide(this.size);
    }
    variance() {
        MinHeap.variance = (MinHeap.x_2.divide(this.size)).minus(MinHeap.mean.pow(2));
    }
    static normalize(element) {
        let normal = new Vector_1.default();
        normal = (element.f.minus(MinHeap.mean)).divide_wise(MinHeap.variance.pow(0.5));
        return normal;
    }
    static normaliz_Gaussion(element) {
        let normal = new Vector_1.default();
        normal = ((element.f.minus(MinHeap.mean)).pow(2)).divide_wise(MinHeap.variance);
        for (let i = 0; i < Vector_1.default.dim; i++) {
            if (element.f.data[i] < MinHeap.mean.data[i]) {
                normal.data[i] = 0;
            }
        }
        return normal;
    }
    static sigmoid(element) {
        let value = new Vector_1.default();
        for (let i = 0; i < Vector_1.default.dim; i++) {
            value.data[i] = MinHeap.sigmoid_function(element.f.data[i] - MinHeap.mean.data[i]);
        }
        return value;
    }
    static sigmoid_normal(element) {
        let value = new Vector_1.default();
        for (let i = 0; i < Vector_1.default.dim; i++) {
            let normal = 0;
            normal = (element.f.data[i] - MinHeap.mean.data[i]) / Math.pow(MinHeap.variance.data[i], 0.5);
            value.data[i] = MinHeap.sigmoid_function(normal);
        }
        return value;
    }
    static sigmoid_function(x) {
        return 1 / (1 + Math.exp(-x));
    }
    getParentNode(index) {
        return Math.floor(index / 2);
    }
    shipUp() {
        let index = this.size;
        while (index > 1 && this.comparator(this.data[index], this.data[this.getParentNode(index)])) {
            this.swap(index, this.getParentNode(index));
            index = this.getParentNode(index);
        }
    }
    isEmpty() {
        return (this.size == 0);
    }
    minimum() {
        return this.data[1];
    }
    swap(i, j) {
        let temp = this.data[i];
        this.data[i] = this.data[j];
        this.data[j] = temp;
    }
    minHeapify(root) {
        let left = 2 * root;
        let right = 2 * root + 1;
        let smallest = -1;
        if (left <= this.size && this.comparator(this.data[left], this.data[root])) {
            smallest = left;
        }
        else {
            smallest = root;
        }
        if (right <= this.size && this.comparator(this.data[right], this.data[smallest])) {
            smallest = right;
        }
        if (smallest != root) {
            this.swap(smallest, root);
            this.minHeapify(smallest);
        }
    }
    buildMinHeap() {
        let start = Math.floor(this.size / 2);
        for (let i = start; i >= 1; i--) {
            this.minHeapify(i);
        }
    }
    toString(all) {
        let s = "";
        if (all) {
            for (let i = 1; i < this.data.length; i++) {
                if (i != 1) {
                    s += ",";
                }
                s += this.data[i].f.data[0].toFixed(2);
            }
        }
        else
            s += this.size;
        return "[" + s + "]";
    }
}
exports.default = MinHeap;
