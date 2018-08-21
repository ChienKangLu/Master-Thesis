"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PriorityQueue {
    constructor() {
        this.data = [];
        this.size = 0;
    }
    setComparator(comparator) {
        this.comparator = comparator;
    }
    add(element) {
        this.data.push(element);
        this.data.sort(this.comparator);
        this.size++;
    }
    pop() {
        this.size--;
        return this.data.pop();
    }
    isEmpty() {
        return this.size == 0;
    }
    toString(all) {
        let s = "";
        if (all) {
            for (let i = 0; i < this.data.length; i++) {
                if (i != 0) {
                    s += ",";
                }
                s += this.data[i].f.data[0].toFixed(2);
            }
        }
        else
            s += this.data.length;
        return "[" + s + "]";
    }
}
exports.default = PriorityQueue;
