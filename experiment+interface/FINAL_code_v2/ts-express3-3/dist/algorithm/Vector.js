"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("../algorithm/Node");
const Tool_1 = require("../algorithm/Tool");
class Vector {
    constructor(data) {
        this.data = [];
        if (data != null)
            this.data = data;
        else {
            this.initial();
        }
    }
    static clear() {
        Vector.dim = 1;
        Vector.orderIndex = [];
        Vector.attr_position = {};
    }
    copy() {
        let CopyVector = new Vector(this.data.slice(0));
        return CopyVector;
    }
    add(vector) {
        let result = [];
        for (let i = 0; i < Vector.dim; i++) {
            result[i] = this.data[i] + vector.data[i];
        }
        return new Vector(result);
    }
    minus(vector) {
        let result = [];
        for (let i = 0; i < Vector.dim; i++) {
            result[i] = this.data[i] - vector.data[i];
        }
        return new Vector(result);
    }
    divide(denominator) {
        let result = [];
        for (let i = 0; i < Vector.dim; i++) {
            result[i] = this.data[i] / denominator;
        }
        return new Vector(result);
    }
    divide_wise(sd) {
        let result = [];
        for (let i = 0; i < Vector.dim; i++) {
            result[i] = this.data[i] / sd.data[i];
        }
        return new Vector(result);
    }
    mutiple(value) {
        let result = [];
        for (let i = 0; i < Vector.dim; i++) {
            result[i] = this.data[i] * value;
        }
        return new Vector(result);
    }
    mutiple_wise(weight) {
        let result = [];
        for (let i = 0; i < Vector.dim; i++) {
            result[i] = this.data[i] * weight.data[i];
        }
        return new Vector(result);
    }
    pow(power) {
        let result = [];
        for (let i = 0; i < Vector.dim; i++) {
            result[i] = Math.pow(this.data[i], power);
        }
        return new Vector(result);
    }
    initial() {
        for (let i = 0; i < Vector.dim; i++) {
            this.data[i] = 0;
        }
    }
    static setOrder(orderIndex) {
        Vector.dim = orderIndex.length;
        Vector.orderIndex = orderIndex;
        Tool_1.default.datanmsg(`orderIndex:[${Vector.orderIndexToString()}]`);
    }
    static setAttr_position() {
        for (let i = 0; i < Vector.dim; i++) {
            if (Vector.orderIndex[i] == Node_1.default.index_distance)
                Vector.attr_position["distance"] = i;
            else if (Vector.orderIndex[i] == Node_1.default.index_attraction)
                Vector.attr_position["attraction"] = i;
            else if (Vector.orderIndex[i] == Node_1.default.index_travelTime)
                Vector.attr_position["travelTime"] = i;
            else if (Vector.orderIndex[i] == Node_1.default.index_edgeExcept)
                Vector.attr_position["edgeExcept"] = i;
        }
    }
    static orderIndexToString() {
        let str = [];
        for (let index of Vector.orderIndex) {
            str.push(Node_1.default.index_string[index]);
        }
        return str;
    }
    toString() {
        let s = "";
        this.data.forEach(function (element, index) {
            if (index != 0) {
                s += ",";
            }
            if (element == Number.MAX_SAFE_INTEGER) {
                s += "∞";
            }
            else if (element == 0) {
                s += "0";
            }
            else {
                s += element.toPrecision(5);
            }
        });
        return "[" + s + "]";
    }
    static findIndex(v, orderIndex) {
        let index = -1;
        for (let i = 0; i < Vector.dim; i++) {
            if (Vector.orderIndex[i] == orderIndex) {
                index = i;
            }
        }
        return index;
    }
}
Vector.dim = 1;
Vector.orderIndex = [];
Vector.attr_position = {};
exports.default = Vector;
