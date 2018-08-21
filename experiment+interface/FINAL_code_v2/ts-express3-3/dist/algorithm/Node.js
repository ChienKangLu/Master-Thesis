"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("../algorithm/Vector");
const POImap_1 = require("../algorithm/POImap");
const Time_1 = require("../algorithm/Time");
const Astar_1 = require("../algorithm/Astar");
class Node {
    constructor(depth, index, poi) {
        this.real_distance = true;
        this.real_traveltime = true;
        if (depth != null && index != null && poi != null) {
            this.depth = depth;
            this.index = index;
            this.poi = poi;
            this.initial();
        }
        else {
        }
    }
    copy(depth, index) {
        let CopyNode = new Node(depth, index, this.poi);
        CopyNode.g = CopyNode.g.copy();
        CopyNode.h = CopyNode.h.copy();
        CopyNode.f = CopyNode.f.copy();
        return CopyNode;
    }
    equals(node) {
        if (node != null) {
            if (node.hashCode() == this.hashCode()) {
                return true;
            }
        }
        else {
            console.log(`This node does not exit,so it can not get Name`);
        }
        return false;
    }
    initial() {
        let gData = [];
        let hData = [];
        let fData = [];
        for (let i = 0; i < Vector_1.default.dim; i++) {
            gData[i] = Number.MAX_SAFE_INTEGER;
            hData[i] = 0;
            fData[i] = Number.MAX_SAFE_INTEGER;
        }
        this.g = new Vector_1.default(gData);
        this.h = new Vector_1.default(hData);
        this.f = new Vector_1.default(fData);
    }
    toString() {
        let s = "";
        s += `${this.poi.name},(${this.poi.global_attraction}),${this.depth},${this.g.toString()},${this.h.toString()},${this.f.toString()}`;
        return s;
    }
    hashCode() {
        let code = "";
        let now = this;
        while (now != null) {
            code += now.depth + "" + now.index;
            now = now.parent;
        }
        return code;
    }
    getPathParent() {
        let now = this;
        let pathParent = [];
        while (now != null) {
            pathParent.push(now.poi._id);
            now = now.parent;
        }
        return pathParent;
    }
    backTrace() {
        let path = [];
        let now = this;
        while (now != null) {
            path.push(`${now.poi.name}(${now.poi.global_attraction}) `);
            now = now.parent;
        }
        path.reverse();
        return path.toString();
    }
    backTraceNode() {
        let path = [];
        let now = this;
        while (now != null) {
            path.push(now);
            now = now.parent;
        }
        return path;
    }
    getH(destination, depth, depthLimit, attr_unit_mean, attr_unit_sd) {
        let h_vector = new Vector_1.default();
        let pack = [];
        let attraction = 0;
        let distance = 0;
        let travelTime = 0;
        let edgeExcept = 0;
        if (Vector_1.default.attr_position["attraction"] != undefined)
            if (Astar_1.default.constraint.attraction_expect_heuristic) {
                attraction = POImap_1.default.fc_dict[depth][this.poi._id];
            }
            else {
                attraction = 0;
            }
        if (Vector_1.default.attr_position["distance"] != undefined)
            distance = POImap_1.default.getPairEdgeDistance(this.poi, destination.poi);
        if (Vector_1.default.attr_position["travelTime"] != undefined)
            travelTime = POImap_1.default.getPairEdgeTravelTime(this.poi, destination.poi);
        if (Vector_1.default.attr_position["edgeExcept"] != undefined)
            edgeExcept = POImap_1.default.getPairEdgeExpect(this.poi, destination.poi);
        if (Astar_1.default.constraint.user_specify) {
            if (Vector_1.default.attr_position["distance"] != undefined)
                distance = POImap_1.default.user_specify(Node.index_distance, distance, attr_unit_mean[Vector_1.default.attr_position["distance"]], attr_unit_sd[Vector_1.default.attr_position["distance"]]);
            if (Vector_1.default.attr_position["travelTime"] != undefined)
                travelTime = POImap_1.default.user_specify(Node.index_travelTime, travelTime, attr_unit_mean[Vector_1.default.attr_position["travelTime"]], attr_unit_sd[Vector_1.default.attr_position["travelTime"]]);
            if (Vector_1.default.attr_position["edgeExcept"] != undefined)
                edgeExcept = POImap_1.default.user_specify(Node.index_edgeExcept, edgeExcept, attr_unit_mean[Vector_1.default.attr_position["edgeExcept"]], attr_unit_sd[Vector_1.default.attr_position["edgeExcept"]]);
        }
        if (Astar_1.default.constraint.distance_heuristic) { }
        else {
            distance = 0;
        }
        if (Astar_1.default.constraint.travelTime_heuristic) { }
        else {
            travelTime = 0;
        }
        if (Astar_1.default.constraint.edgeExcept_heuristic) { }
        else {
            edgeExcept = 0;
        }
        pack = [attraction, travelTime, distance, edgeExcept];
        for (let i = 0; i < Vector_1.default.dim; i++) {
            h_vector.data[i] = pack[Vector_1.default.orderIndex[i]];
        }
        return h_vector;
    }
    getCost(previos, attr_unit_mean, attr_unit_sd) {
        let cost_vector = new Vector_1.default();
        let pack = [];
        let attraction = 0;
        let distance = 0;
        let travelTime = 0;
        let edgeExcept = 0;
        if (Vector_1.default.attr_position["attraction"] != undefined)
            attraction = this.poi.global_attraction_cost;
        distance = POImap_1.default.getPairEdgeDistance(previos.poi, this.poi);
        travelTime = POImap_1.default.getPairEdgeTravelTime(previos.poi, this.poi);
        edgeExcept = POImap_1.default.getPairEdgeExpect(previos.poi, this.poi);
        this.travelFromPrevious = travelTime * 60 * 60 * 1000;
        this.disFromPrevious = distance;
        if (POImap_1.default.pairEdge[previos.poi._id][this.poi._id].distance == null) {
            this.real_distance = false;
        }
        if (POImap_1.default.pairEdge[previos.poi._id][this.poi._id].travelTime == null) {
            this.real_traveltime = false;
        }
        if (Astar_1.default.constraint.user_specify) {
            if (Vector_1.default.attr_position["attraction"] != undefined)
                attraction = POImap_1.default.user_specify(Node.index_attraction, attraction, attr_unit_mean[Vector_1.default.attr_position["attraction"]], attr_unit_sd[Vector_1.default.attr_position["attraction"]]);
            if (Vector_1.default.attr_position["distance"] != undefined)
                distance = POImap_1.default.user_specify(Node.index_distance, distance, attr_unit_mean[Vector_1.default.attr_position["distance"]], attr_unit_sd[Vector_1.default.attr_position["distance"]]);
            if (Vector_1.default.attr_position["travelTime"] != undefined)
                travelTime = POImap_1.default.user_specify(Node.index_travelTime, travelTime, attr_unit_mean[Vector_1.default.attr_position["travelTime"]], attr_unit_sd[Vector_1.default.attr_position["travelTime"]]);
            if (Vector_1.default.attr_position["edgeExcept"] != undefined)
                edgeExcept = POImap_1.default.user_specify(Node.index_edgeExcept, edgeExcept, attr_unit_mean[Vector_1.default.attr_position["edgeExcept"]], attr_unit_sd[Vector_1.default.attr_position["edgeExcept"]]);
        }
        pack = [attraction, travelTime, distance, edgeExcept];
        for (let i = 0; i < Vector_1.default.dim; i++) {
            cost_vector.data[i] = pack[Vector_1.default.orderIndex[i]];
        }
        return cost_vector;
    }
    getSuccessor(depth, depthLimit, destination, distanceLimit, withinDistance) {
        let temp = [];
        if (this.poi._id == destination.poi._id || depth == depthLimit) {
            return temp;
        }
        else if (depth == depthLimit - 1) {
            temp.push(new Node(depth + 1, 0, destination.poi));
            return temp;
        }
        let pathPrent = this.getPathParent();
        let index = 0;
        for (let poi of POImap_1.default.pois) {
            if (Astar_1.default.constraint.km15)
                if (POImap_1.default.pairEdge[this.poi._id][poi._id].distance == null) {
                    continue;
                }
            let exit = false;
            for (let parent of pathPrent) {
                if (poi._id == parent) {
                    exit = true;
                }
            }
            if (poi._id == destination.poi._id && depth != depthLimit - 1) {
                exit = true;
            }
            if (!exit) {
                if (distanceLimit)
                    if (!this.withinCircle(this.poi, poi, withinDistance)) {
                        break;
                    }
                temp.push(new Node(depth + 1, index, poi));
                index++;
            }
        }
        return temp;
    }
    withinCircle(now, successor, withinDistance) {
        if (POImap_1.default.pairEdge[now._id][successor._id].distance <= withinDistance)
            return true;
        else
            return false;
    }
    arrive(from, start_time) {
        if (from == null && start_time != null) {
            this.arrive_time = start_time.copy();
        }
        else if (from != null) {
            this.arrive_time = from.depart_time.add(POImap_1.default.getPairEdgeTravelTime(from.poi, this.poi), "hour");
        }
    }
    openOrClose() {
        if (this.correctTimestatus != null)
            return true;
        let nowWeek = this.arrive_time.time.getDay();
        let dayTime = this.poi.weekTime[nowWeek];
        this.correctTimestatus = Time_1.default.whichTimeStatus(dayTime, this.arrive_time);
        if (this.correctTimestatus != null)
            return true;
        return false;
    }
    updateArriveTime() {
        if (this.correctTimestatus.status != "Open24hours") {
            let open = this.correctTimestatus.open.time;
            let arrive_open = this.arrive_time.minus(open, false);
            if (arrive_open < 0) {
                this.arrive_time = open.copy();
                this.waitTime = Time_1.default.millionToDetail(Math.abs(arrive_open));
            }
            else {
            }
        }
    }
    depart() {
        this.depart_time = this.arrive_time.add(this.poi.stay_time, "hour");
    }
    completeOrNot() {
        if (this.correctTimestatus.status != "Open24hours") {
            let close = this.correctTimestatus.close.time;
            let depart_close = this.depart_time.minus(close, false);
            if (depart_close > 0) {
                return false;
            }
        }
        return true;
    }
    withinTimeBuget(end_time) {
        let depart_end = this.depart_time.minus(end_time, false);
        if (depart_end > 0) {
            return false;
        }
        return true;
    }
    extraTime(end_time) {
        this.extra_time = end_time.minus(this.depart_time, false);
    }
    reasonable(destination_poi, end_time, depthLimit) {
        if (this.depth != depthLimit) {
            let general_pois_count = depthLimit - this.depth - 1;
            let general_visit = general_pois_count * 1;
            let general_travel = (general_pois_count + 1) * 0;
            let general_depart_time = this.depart_time.add(general_visit + general_travel, "hour");
            let simulate_end_node = new Node(-1, -1, destination_poi);
            simulate_end_node.arrive_time = general_depart_time;
            if (!simulate_end_node.openOrClose()) {
                return false;
            }
            simulate_end_node.updateArriveTime();
            simulate_end_node.depart();
            if (!simulate_end_node.completeOrNot()) {
                return false;
            }
        }
        return true;
    }
    setSerialNumber(serial_number) {
        this.serial_number = serial_number;
    }
}
Node.index_attraction = 0;
Node.index_travelTime = 1;
Node.index_distance = 2;
Node.index_edgeExcept = 3;
Node.index_num = 4;
Node.index_string = ["attraction", "time", "distance", "edgeExcept"];
exports.default = Node;
