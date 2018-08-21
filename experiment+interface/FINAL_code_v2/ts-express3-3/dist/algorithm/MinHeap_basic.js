"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Minheap {
    constructor() {
        this.data = [0];
        this.size = 0;
    }
    insert(value) {
        this.data.push(value);
        this.size++;
        this.shipUp();
    }
    popMin() {
        if (this.isHeapEmpity()) {
            return null;
        }
        let min = this.minimum();
        this.data[1] = this.data[this.size];
        this.data.pop();
        this.size--;
        this.minHeapify(1);
        return min;
    }
    getParentNode(index) {
        return Math.floor(index / 2);
    }
    shipUp() {
        let index = this.size;
        while (index > 1 && this.data[this.getParentNode(index)] > this.data[index]) {
            this.swap(index, this.getParentNode(index));
            index = this.getParentNode(index);
        }
    }
    isHeapEmpity() {
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
        if (left <= this.size && this.data[left] < this.data[root]) {
            smallest = left;
        }
        else {
            smallest = root;
        }
        if (right <= this.size && this.data[right] < this.data[smallest]) {
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
    toString() {
        let str = "";
        return JSON.stringify(this.data);
    }
}
exports.default = Minheap;
