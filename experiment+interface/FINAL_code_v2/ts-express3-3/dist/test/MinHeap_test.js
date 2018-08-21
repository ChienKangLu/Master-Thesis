"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("../algorithm/Vector");
class Node {
    constructor(num, priority, idx) {
        if (num != null && priority != null && idx != null) {
            this.num = num;
            this.priority = priority;
            this.idx = idx;
        }
    }
    toString() {
        return `${this.num}(${this.priority})`;
    }
}
class MinHeap {
    constructor() {
        this.data = [new Node()];
        this.size = 0;
    }
    setComparator(comparator) {
        this.comparator = comparator;
    }
    add(element) {
        this.data.push(element);
        this.size++;
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
        this.minHeapify(1);
        return min;
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
                s += this.data[i].toString();
            }
        }
        else
            s += this.size;
        return "[" + s + "]";
    }
}
function comparator_heap(left, right) {
    for (let i = 0; i < Vector_1.default.dim; i++) {
        if (left.num == right.num) {
            if (left.idx < right.idx) {
                return true;
            }
            return false;
        }
        else if (left.num < right.num) {
            return true;
        }
        else {
            return false;
        }
    }
    return false;
}
let node = [
    new Node(5, "A", 1),
    new Node(5, "B", 2),
    new Node(5, "C", 3),
    new Node(5, "D", 4),
    new Node(3, "A", 5),
    new Node(2, "A", 6),
    new Node(1, "A", 7)
];
let openlist = new MinHeap();
openlist.setComparator(comparator_heap);
for (let i = 0; i < node.length; i++) {
    openlist.add(node[i]);
    console.log(`insert ${i}:${openlist.toString(true)}`);
}
for (let i = 0; i < node.length; i++) {
    console.log(`pop:${openlist.pop()}`);
    console.log(`${openlist.toString(true)}`);
}
