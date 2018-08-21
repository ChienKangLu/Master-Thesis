"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tool_1 = require("../algorithm/Tool");
const Astar_1 = require("./Astar");
const Expectation_new_1 = require("../algorithm/Expectation_new");
class POImap {
    static insertPoi(poi) {
        POImap.pois.push(poi);
        if (poi.global_attraction > POImap.maxGlobalAttraction) {
            POImap.maxGlobalAttraction = poi.global_attraction;
        }
    }
    static insertPairEdge(from, to, distance, travelTime, lineDistance, lineTravelTime, edgeExcept) {
        if (POImap.pairEdge[from] == null) {
            let edge = {};
            POImap.pairEdge[from] = edge;
        }
        let edgeData = null;
        if (edgeExcept == null)
            edgeData = { distance, travelTime, lineDistance, lineTravelTime };
        else
            edgeData = { distance, travelTime, lineDistance, lineTravelTime, edgeExcept };
        POImap.pairEdge[from][to] = edgeData;
    }
    static getPairEdgeDistance(from, to) {
        let distance = POImap.pairEdge[from._id][to._id].distance;
        if (distance == null) {
            distance = POImap.pairEdge[from._id][to._id].lineDistance;
        }
        return distance;
    }
    static getPairEdgeTravelTime(from, to) {
        let travelTime = POImap.pairEdge[from._id][to._id].travelTime;
        if (travelTime == null) {
            travelTime = POImap.pairEdge[from._id][to._id].lineTravelTime;
        }
        return travelTime;
    }
    static getPairEdgeExpect(from, to) {
        let edgeExcept = POImap.pairEdge[from._id][to._id].edgeExcept;
        return edgeExcept;
    }
    static printPairEdge() {
        let fromKeys = Object.keys(POImap.pairEdge);
        for (let from in POImap.pairEdge) {
            for (let to in POImap.pairEdge[from]) {
                let distance = POImap.pairEdge[from][to].distance;
                let travelTime = POImap.pairEdge[from][to].travelTime;
                console.log(`(${from},${to},${distance},${travelTime.toPrecision(2)})`);
            }
        }
    }
    static printPOIs() {
        let s = "";
        let index = 0;
        POImap.pois.forEach((element) => { s = s + `${index}:${element.toString()}`; index++; });
        return s;
    }
    static reverse() {
        POImap.pois.forEach((element) => {
            element.global_attraction_cost = POImap.maxGlobalAttraction - element.global_attraction;
        });
    }
    static set_realTimes(start_time) {
        for (let poi of POImap.pois) {
            poi.set_realTime(start_time);
        }
    }
    static setUp(start_time, depth_limit, start_id, destination_id, attr_unit_mean, attr_unit_sd, r) {
        POImap.reverse();
        Tool_1.default.actionmsg(`After reverse`);
        Tool_1.default.datanmsg(`maxGlobalAttraction:${this.maxGlobalAttraction}`);
        POImap.set_realTimes(start_time);
        Tool_1.default.actionmsg(`Compute all week_time accroding to start_time`);
        if (Astar_1.default.constraint.attraction_expect_heuristic) {
            let expectation = new Expectation_new_1.default(POImap.pois.length, depth_limit, start_id, destination_id, attr_unit_mean, attr_unit_sd, r);
            POImap.fc_dict = expectation.fc_dict;
        }
    }
    static findFromPOImap(_id) {
        for (let poi of POImap.pois) {
            if (poi._id == _id) {
                return poi;
            }
        }
        return null;
    }
    static findFromPOImapByName(name) {
        for (let poi of POImap.pois) {
            if (poi.name == name) {
                return poi._id;
            }
        }
        return null;
    }
    static clear() {
        POImap.pois = [];
        POImap.pairEdge = {};
        POImap.maxGlobalAttraction = Number.MIN_VALUE;
        POImap.fc_dict = [];
    }
    static toString() {
        return `number of poi:${POImap.pois.length}\nnumber of pairEdge:${Math.pow(Object.keys(POImap.pairEdge).length, 2)}`;
    }
    static printAllpoi() {
        for (let poi of POImap.pois) {
            console.log(`${JSON.stringify(poi.weekTime, null, 4)}`);
            let timeStatus = poi.weekTime[0][0];
            if (timeStatus.open != null) {
                if (timeStatus.open.time != null)
                    console.log(`${timeStatus.open.time.toString()}`);
            }
        }
    }
    static user_specify(index, x, mean, sd) {
        let normal = POImap.normal(x, mean, sd);
        return POImap.sigmoid_function(normal, 0.5);
    }
    static normal(x, mean, sd) {
        return (x - mean) / sd;
    }
    static sigmoid_function(x, alpha) {
        let value = 1 / (1 + Math.exp(-alpha * x));
        if (isNaN(value)) {
            console.log(`POImap got a NAN!!Check now:${x},${alpha}`);
        }
        return value;
    }
}
POImap.pois = [];
POImap.pairEdge = {};
POImap.maxGlobalAttraction = Number.MIN_VALUE;
POImap.fc_dict = [];
exports.default = POImap;
