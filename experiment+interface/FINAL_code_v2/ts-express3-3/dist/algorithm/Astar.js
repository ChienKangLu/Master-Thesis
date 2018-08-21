"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("../algorithm/Node");
const PriorityQueue_1 = require("../algorithm/PriorityQueue");
const Vector_1 = require("../algorithm/Vector");
const POImap_1 = require("../algorithm/POImap");
const Time_1 = require("../algorithm/Time");
const Tool_1 = require("../algorithm/Tool");
const MinHeap_1 = require("../algorithm/MinHeap");
class Astar {
    constructor(request, constraint) {
        this.closelist = [];
        this.timer = false;
        this.exp_wait = 0;
        this.nodeLimit = false;
        this.nodeLimitNumber = 0;
        this.nodeNum = 0;
        this.distanceLimit = false;
        this.withinDistance = 0;
        this.serial_number = 0;
        this.Result = {};
        this.pruned_count = {
            openOrClose: 0,
            completeOrNot: 0,
            reasonable: 0
        };
        this.start = new Node_1.default(0, 0, POImap_1.default.findFromPOImap(request.start_id));
        this.destination = new Node_1.default(0, 0, POImap_1.default.findFromPOImap(request.destination_id));
        this.depthLimit = request.depthLimit;
        this.start_time = request.start_time;
        this.end_time = request.end_time;
        this.startmsg();
        Vector_1.default.setOrder(request.orderIndex);
        Vector_1.default.setAttr_position();
        this.setConstraint(constraint);
        this.setConstraintDetail(request);
        POImap_1.default.setUp(request.start_time, this.depthLimit, this.start.poi._id, this.destination.poi._id, this.attr_unit_mean, this.attr_unit_sd, this.r);
        if (Astar.constraint.structure_minheap)
            this.openlist = new MinHeap_1.default();
        if (Astar.constraint.structure_openlist)
            this.openlist = new PriorityQueue_1.default();
        this.setComparator();
        this.ini_pruned_count();
        this.destination.poi.global_attraction_cost = 0;
    }
    search() {
        Tool_1.default.sysmsg('search start');
        let index = 1;
        let timer_start = new Time_1.default(new Date());
        let timer_now;
        if (!this.validate(this.start, undefined, this.start_time)) {
            Tool_1.default.rungmsg(`NOT FOUND ANY PATH AT ROOT(A)`);
            this.endmsg(this.start, this.Result, "NOT FOUND ANY PATH AT ROOT(A)", "A");
            return this.Result;
        }
        this.start.g.initial();
        this.start.g = this.start.g.add(this.start.getCost(this.start, this.attr_unit_mean, this.attr_unit_sd));
        this.start.h = this.start.getH(this.destination, 0, this.depthLimit, this.attr_unit_mean, this.attr_unit_sd);
        this.start.f = this.start.g.add(this.start.h);
        this.giveSerialNumber(this.start);
        this.openlist.add(this.start, this.serial_number);
        this.nodeNum++;
        while (!this.openlist.isEmpty()) {
            timer_now = new Time_1.default(new Date());
            let now = this.openlist.pop();
            Tool_1.default.rungmsg(`index:${index}`);
            index++;
            Tool_1.default.rungmsg(`openlist:${this.openlist.toString(false)}`);
            Tool_1.default.rungmsg(`depth:${now.depth}`);
            Tool_1.default.rungmsg(`now:${now.toString()}`);
            if (now.parent != null) {
                Tool_1.default.rungmsg(`parent:${now.parent.toString()}`);
                if (now.parent.parent != null)
                    Tool_1.default.rungmsg(`parent of parant:${now.parent.parent.toString()}`);
            }
            this.closelist.push(now);
            if (this.goal(now, now.depth)) {
                this.endmsg(now, this.Result, "find a path", "good");
                return this.Result;
            }
            let succesors = now.getSuccessor(now.depth, this.depthLimit, this.destination, this.distanceLimit, this.withinDistance);
            Tool_1.default.rungmsg(`successors:${succesors.length}`);
            for (let S of succesors) {
                if (!this.validate(S, now, undefined)) {
                    continue;
                }
                let vectorG = now.g.add(S.getCost(now, this.attr_unit_mean, this.attr_unit_sd));
                let vectorH = S.getH(this.destination, S.depth, this.depthLimit, this.attr_unit_mean, this.attr_unit_sd);
                let vectorF = vectorG.add(vectorH);
                S.g = vectorG;
                S.h = vectorH;
                S.f = vectorF;
                S.parent = now;
                this.giveSerialNumber(S);
                this.openlist.add(S, this.serial_number);
                this.nodeNum++;
            }
            Tool_1.default.rungmsg(`successors reserved:${succesors.length - this.pruned_count.completeOrNot - this.pruned_count.openOrClose - this.pruned_count.reasonable}`);
            this.print_pruned_count();
            this.ini_pruned_count();
            Tool_1.default.rungmsg(`--------------------------------`);
            if (this.nodeNum >= this.nodeLimitNumber && this.nodeLimit) {
                Tool_1.default.rungmsg(`NODENUM MORE THAN ${this.nodeLimitNumber} NODES, NOT FOUND ANY PATH(D)`);
                this.endmsg(now, this.Result, `NODENUM MORE THAN ${this.nodeLimitNumber} NODES, NOT FOUND ANY PATH(D)`, "D");
                return this.Result;
            }
            if (timer_now.minus(timer_start, true) >= this.exp_wait && this.timer) {
                Tool_1.default.rungmsg(`EXCEEDING ${this.exp_wait} MILLIONS, NOT FOUND ANY PATH(C)`);
                this.endmsg(now, this.Result, `EXCEEDING ${this.exp_wait} MILLIONS, NOT FOUND ANY PATH(C)`, "C");
                return this.Result;
            }
        }
        Tool_1.default.rungmsg(`NOT FOUND OPTIMAL PATH OPTIMAL(B)`);
        this.endmsg(this.start, this.Result, "NOT FOUND OPTIMAL PATH OPTIMAL(B)", "B");
        return this.Result;
    }
    ini_pruned_count() {
        this.pruned_count.completeOrNot = 0;
        this.pruned_count.openOrClose = 0;
        this.pruned_count.reasonable = 0;
    }
    print_pruned_count() {
        Tool_1.default.rungmsg(`[pruning]`);
        Tool_1.default.rungmsg(`  --completeOrNot:${this.pruned_count.completeOrNot}`);
        Tool_1.default.rungmsg(`  --openOrClose:${this.pruned_count.openOrClose}`);
        Tool_1.default.rungmsg(`  --reasonable:${this.pruned_count.reasonable}`);
    }
    validate(now, from, start_time) {
        if (now.poi._id == this.start.poi._id)
            from = undefined;
        if (Astar.constraint.considerMustVisit_order)
            if (!this.consider_Vist_order(now, this.mustVisit_order, true)) {
                return false;
            }
        if (Astar.constraint.considerMustNotVist)
            if (!this.consider_Vist(now, this.mustNotVist, false))
                return false;
        if (Astar.constraint.considerMustNotVisit_order)
            if (!this.consider_Vist_order(now, this.mustNotVisit_order, false))
                return false;
        if (Astar.constraint.considerWeekTime) {
            now.arrive(from, start_time);
            if (!now.openOrClose()) {
                this.pruned_count.openOrClose++;
                return false;
            }
            now.updateArriveTime();
            now.depart();
            if (!now.completeOrNot()) {
                this.pruned_count.completeOrNot++;
                return false;
            }
            if (!now.withinTimeBuget(this.end_time)) {
                return false;
            }
            now.extraTime(this.end_time);
        }
        if (Astar.constraint.considerReasonable) {
            if (!now.reasonable(this.destination.poi, this.end_time, this.depthLimit)) {
                Tool_1.default.detailmsg(`${now.poi.name} -> pruned: because reasonable`);
                this.pruned_count.reasonable++;
                return false;
            }
        }
        return true;
    }
    validate_end(now, from, start_time) {
        if (now.poi._id == this.start.poi._id)
            from = undefined;
        now.arrive(from, start_time);
        if (!now.openOrClose())
            return false;
        now.updateArriveTime();
        now.depart();
        if (!now.completeOrNot())
            return false;
        if (!now.withinTimeBuget(this.end_time))
            return false;
        now.extraTime(this.end_time);
        if (!now.reasonable(this.destination.poi, this.end_time, this.depthLimit)) {
            return false;
        }
        return true;
    }
    consider_Vist(now, visit_orders, go) {
        let gate = false;
        for (let visit_order of visit_orders) {
            if (now.poi._id == visit_order) {
                gate = true;
                break;
            }
        }
        if (gate == go) {
            return true;
        }
        else {
            return false;
        }
    }
    consider_Vist_order(now, visit_orders, go) {
        let include = false;
        let gate = false;
        for (let visit_order of visit_orders) {
            if (now.depth == visit_order.order) {
                include = true;
                if (now.poi._id == visit_order._id && now.depth == visit_order.order) {
                    gate = true;
                    break;
                }
            }
        }
        if (include == true) {
            if (gate == go) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }
    comparator_heap(left, right) {
        for (let i = 0; i < Vector_1.default.dim; i++) {
            if (left.f.data[i] == right.f.data[i]) {
                if (left.serial_number < right.serial_number) {
                    return true;
                }
                return false;
            }
            else if (left.f.data[i] < right.f.data[i]) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }
    comparator_heap_normalize(left, right) {
        let left_normal_f = MinHeap_1.default.normalize(left);
        let right_normal_f = MinHeap_1.default.normalize(right);
        let compare = left_normal_f.minus(right_normal_f);
        let compate_sum = 0;
        for (let i = 0; i < Vector_1.default.dim; i++) {
            compate_sum += compare.data[i];
        }
        if (compate_sum < 0) {
            return true;
        }
        else if (compate_sum > 0) {
            return false;
        }
        else if (compate_sum == 0) {
            if (left.serial_number < right.serial_number) {
                return true;
            }
        }
        return false;
    }
    comparator_heap_normalize_gaussian(left, right) {
        let left_normal_f = MinHeap_1.default.normaliz_Gaussion(left);
        let right_normal_f = MinHeap_1.default.normaliz_Gaussion(right);
        let compare = left_normal_f.minus(right_normal_f);
        let compate_sum = 0;
        for (let i = 0; i < Vector_1.default.dim; i++) {
            compate_sum += compare.data[i];
        }
        if (compate_sum < 0) {
            return true;
        }
        else if (compate_sum > 0) {
            return false;
        }
        return false;
    }
    comparater_heap_sigmoid(left, right) {
        let left_normal_f = MinHeap_1.default.sigmoid(left);
        let right_normal_f = MinHeap_1.default.sigmoid(right);
        let compare = left_normal_f.minus(right_normal_f);
        let compare_sum = 0;
        for (let i = 0; i < Vector_1.default.dim; i++) {
            compare_sum += compare.data[i];
        }
        if (compare_sum == 0) {
            if (left.serial_number < right.serial_number) {
                return true;
            }
            return false;
        }
        if (compare_sum < 0) {
            return true;
        }
        else if (compare_sum > 0) {
            return false;
        }
        return false;
    }
    comparater_heap_normal_sigmoid(left, right) {
        let left_normal_f = MinHeap_1.default.sigmoid_normal(left);
        let right_normal_f = MinHeap_1.default.sigmoid_normal(right);
        let compare = left_normal_f.minus(right_normal_f);
        let compare_sum = 0;
        for (let i = 0; i < Vector_1.default.dim; i++) {
            compare_sum += compare.data[i];
        }
        if (compare_sum == 0) {
            if (left.serial_number < right.serial_number) {
                return true;
            }
            return false;
        }
        if (compare_sum < 0) {
            return true;
        }
        else if (compare_sum > 0) {
            return false;
        }
        return false;
    }
    comparater_heap_sum(left, right) {
        let sumLeft = 0;
        let sumRight = 0;
        for (let i = 0; i < Vector_1.default.dim; i++) {
            sumLeft += left.f.data[i];
            sumRight += right.f.data[i];
        }
        let compare = sumLeft - sumRight;
        if (compare == 0) {
            if (left.serial_number < right.serial_number) {
                return true;
            }
            return false;
        }
        if (compare < 0) {
            return true;
        }
        else if (compare > 0) {
            return false;
        }
        return false;
    }
    comparator(left, right) {
        for (let i = 0; i < Vector_1.default.dim; i++) {
            if (left.f.data[i] < right.f.data[i]) {
                return 1;
            }
            else if (left.f.data[i] > right.f.data[i]) {
                return -1;
            }
        }
        return 0;
    }
    goal(now, depth) {
        if (Astar.constraint.considerMustVist)
            if (!this.consider_Vist(now, this.mustVist, true))
                return false;
        if (depth == this.depthLimit && now.poi._id == this.destination.poi._id) {
            let pathNode = now.backTraceNode();
            pathNode.reverse();
            if (Astar.constraint.validateEnd) {
                let parent;
                let child;
                for (let i = 0; i < pathNode.length; i++) {
                    let node = pathNode[i];
                    parent = node.parent;
                    child = node;
                    if (i == 0) {
                        if (!this.validate_end(child, parent, this.start_time)) {
                            return false;
                        }
                    }
                    else {
                        if (!this.validate_end(child, parent, undefined)) {
                            return false;
                        }
                    }
                }
            }
            else {
                for (let i = 0; i < pathNode.length; i++) {
                    let node = pathNode[i];
                    if (!now.openOrClose())
                        return false;
                    if (!now.completeOrNot())
                        return false;
                    if (!now.withinTimeBuget(this.end_time))
                        return false;
                }
            }
            return true;
        }
        return false;
    }
    startmsg() {
        Tool_1.default.datanmsg(`start_time:${this.start_time.toString()}`);
        Tool_1.default.datanmsg(`end_time:${this.end_time.toString()}`);
        Tool_1.default.datanmsg(`start:${this.start.poi.name}`);
        Tool_1.default.datanmsg(`destination:${this.destination.poi.name}`);
        Tool_1.default.datanmsg(`depthLimit:${this.depthLimit}`);
    }
    endmsg(now, Result, description, type) {
        Tool_1.default.sysmsg(`search over`);
        let pathString = now.backTrace();
        Tool_1.default.datanmsg(`path:[${pathString}]`);
        let path = now.backTraceNode();
        path.reverse();
        if (type == "C") {
            this.Result.description = description;
            this.Result.type = type;
            this.Result.path = path;
            return;
        }
        Tool_1.default.datanmsg(`g:${now.g}`);
        Tool_1.default.datanmsg(`h:${now.h}`);
        Tool_1.default.datanmsg(`f:${now.f}`);
        let totalDis_Atr_Tra = this.totalDis_Atr_Tra(path);
        Tool_1.default.datanmsg(`totalDis_Atr_Tra:${JSON.stringify(totalDis_Atr_Tra)}`);
        let totalDistance = totalDis_Atr_Tra.totalDistance;
        let totalAtraction = totalDis_Atr_Tra.totalAtraction;
        let totalTravelTime = totalDis_Atr_Tra.totalTravelTime;
        let trip_Duration = this.start_time.minus(now.depart_time, true);
        let extraTime = path[path.length - 1].extra_time;
        let internalAttraction = totalAtraction - path[0].poi.global_attraction - path[path.length - 1].poi.global_attraction;
        Tool_1.default.datanmsg(`internalAttraction:${internalAttraction}`);
        Tool_1.default.datanmsg(`trip duration:${JSON.stringify(Time_1.default.millionToDetail(trip_Duration))}`);
        Tool_1.default.datanmsg(`finish trip time:${now.depart_time.toString()}`);
        Tool_1.default.datanmsg(`extra_time:${JSON.stringify(Time_1.default.millionToDetail(extraTime))}`);
        Tool_1.default.datanmsg(`totalAtraction:${totalAtraction}`);
        Tool_1.default.datanmsg(`nodeNum:${this.nodeNum}`);
        this.Result = {
            path: path,
            start: this.start,
            destination: this.destination,
            start_time: this.start_time,
            end_time: this.end_time,
            finishTime: now.depart_time,
            totalDistance: totalDistance,
            totalAttraction: totalAtraction,
            totalTravelTime: totalTravelTime,
            depthLimit: this.depthLimit,
            trip_Duration: trip_Duration,
            description: description,
            pathString: pathString,
            nodeNum: this.nodeNum,
            extraTime: extraTime,
            internalAttraction: internalAttraction,
            type: type
        };
    }
    original(g, index) {
        let true_index = Vector_1.default.findIndex(g, index);
        if (true_index != -1)
            if (index == Node_1.default.index_attraction)
                return (g.data[true_index] + this.start.poi.global_attraction_cost) * -1 + (this.depthLimit + 1) * POImap_1.default.maxGlobalAttraction;
            else
                return g.data[true_index];
        else
            return undefined;
    }
    totalDis_Atr_Tra(path) {
        let totalDistance = 0;
        let totalAtraction = 0;
        let totalTravelTime = 0;
        for (let i = 0; i < path.length - 1; i++) {
            let from = path[i].poi;
            let to = path[i + 1].poi;
            totalDistance += POImap_1.default.getPairEdgeDistance(from, to);
            totalTravelTime += POImap_1.default.getPairEdgeTravelTime(from, to);
            totalAtraction += from.global_attraction * 10;
        }
        totalAtraction += path[path.length - 1].poi.global_attraction * 10;
        totalAtraction = totalAtraction / 10;
        let pack = {
            totalDistance: totalDistance,
            totalAtraction: totalAtraction,
            totalTravelTime: totalTravelTime,
        };
        return pack;
    }
    setConstraint(constraint) {
        Astar.constraint = constraint;
    }
    setConstraintDetail(request) {
        if (Astar.constraint.considerMustVisit_order)
            this.mustVisit_order = request.mustVisit_order;
        if (Astar.constraint.considerMustNotVist)
            this.mustNotVist = request.mustNotVist;
        if (Astar.constraint.considerMustNotVisit_order)
            this.mustNotVisit_order = request.mustNotVisit_order;
        if (Astar.constraint.considerMustVist)
            this.mustVist = request.mustVist;
        if (Astar.constraint.timer) {
            this.timer = true;
            this.exp_wait = request.exp_wait;
        }
        if (Astar.constraint.nodeLimit) {
            this.nodeLimit = true;
            this.nodeLimitNumber = request.nodeLimitNumber;
        }
        if (Astar.constraint.distanceLimit) {
            this.distanceLimit = true;
            this.withinDistance = request.withinDistance;
        }
        if (Astar.constraint.user_specify) {
            this.attr_unit_mean = request.attr_unit_mean;
            this.attr_unit_sd = request.attr_unit_sd;
            for (let i = 0; i < Vector_1.default.dim; i++) {
                if (Vector_1.default.orderIndex[i] == Node_1.default.index_attraction) {
                    this.attr_unit_mean[i] = POImap_1.default.maxGlobalAttraction - this.attr_unit_mean[i];
                }
            }
        }
        if (Astar.constraint.tuning) {
            this.r = request.r;
        }
    }
    setComparator() {
        if (Astar.constraint.comparator)
            this.openlist.setComparator(this.comparator);
        if (Astar.constraint.comparator_heap)
            this.openlist.setComparator(this.comparator_heap);
        if (Astar.constraint.comparator_heap_normalize_gaussian)
            this.openlist.setComparator(this.comparator_heap_normalize_gaussian);
        if (Astar.constraint.comparater_heap_sigmoid)
            this.openlist.setComparator(this.comparater_heap_sigmoid);
        if (Astar.constraint.comparater_heap_normal_sigmoid)
            this.openlist.setComparator(this.comparater_heap_normal_sigmoid);
        if (Astar.constraint.comparater_heap_sum)
            this.openlist.setComparator(this.comparater_heap_sum);
    }
    giveSerialNumber(node) {
        node.setSerialNumber(this.serial_number);
        this.serial_number++;
    }
}
exports.default = Astar;
