"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Time_1 = require("../algorithm/Time");
class POI {
    constructor(name, global_attraction, _id, lat, lng, stay_time, weekTime, introduction) {
        this.weekTime = [];
        this.global_attraction = this.check_global_attraction(global_attraction);
        this.name = name;
        this._id = _id;
        this.lat = lat;
        this.lng = lng;
        this.stay_time = this.check_stay_time(stay_time);
        this.weekTime = weekTime;
        if (introduction != null) {
            this.introduction = introduction;
        }
    }
    check_global_attraction(global_attraction) {
        if (global_attraction == null) {
            global_attraction = POI.initial_global_attraction;
        }
        return global_attraction;
    }
    check_stay_time(stay_time) {
        if (stay_time == null || stay_time == 0) {
            stay_time = POI.initial_stay_time;
        }
        return stay_time;
    }
    set_realTime(start_time) {
        Time_1.default.realTime(this.weekTime, start_time);
    }
    copy() {
        return new POI(this.name, this.global_attraction, this._id, this.lat, this.lng, this.stay_time, this.weekTime);
    }
    toString() {
        return `(${this.name}:${this.global_attraction_cost})`;
    }
}
POI.initial_global_attraction = 0;
POI.initial_stay_time = 1;
exports.default = POI;
