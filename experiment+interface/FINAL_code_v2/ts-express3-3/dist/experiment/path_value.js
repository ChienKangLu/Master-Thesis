"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const POI_1 = require("../algorithm/POI");
const POImap_1 = require("../algorithm/POImap");
const vzTaiwan_1 = require("../preprocess/vzTaiwan");
const Tool_1 = require("../algorithm/Tool");
const DBAsync_1 = require("../database/DBAsync");
function ini_edge() {
    for (let from in POImap_1.default.pairEdge) {
        for (let to in POImap_1.default.pairEdge[from]) {
            let distance = POImap_1.default.pairEdge[from][to].distance;
            if (distance == null) {
                distance = POImap_1.default.pairEdge[from][to].lineDistance;
            }
            let travelTime = POImap_1.default.pairEdge[from][to].travelTime;
            if (travelTime == null) {
                travelTime = POImap_1.default.pairEdge[from][to].lineTravelTime;
            }
            POImap_1.default.pairEdge[from][to].distance = distance;
            POImap_1.default.pairEdge[from][to].travelTime = travelTime;
        }
    }
}
function calculate_path_value(exps, satisfy) {
    let create_field_datas = [];
    for (let exp of exps) {
        create_field_datas.push(path_value(exp._id.toString(), exp.index, exp.Result, satisfy));
    }
    return create_field_datas;
}
function path_value(exp_id, exp_index, Result, satisfy) {
    let path = Result.path;
    let depthLimit = Result.depthLimit;
    let value = 0;
    for (let node of path) {
        let now_id = node.poi._id;
        if (node.depth > 0) {
            let parent_id = node.parent.poi._id;
            let distance = POImap_1.default.pairEdge[parent_id][now_id].distance;
            let travelTime = POImap_1.default.pairEdge[parent_id][now_id].travelTime;
            value += f(distance, satisfy.s_distance, satisfy.tol_distance);
        }
        if (node.depth > 0 && node.depth < depthLimit) {
            let attraction_cost = node.poi.global_attraction_cost;
            value += f(attraction_cost, satisfy.s_attraction, satisfy.tol_attraction);
        }
    }
    let data = {
        exp_id: exp_id,
        exp_index: exp_index,
        value: value
    };
    return data;
}
function f(x, s, tol) {
    let normal_distance = normal(x, s, tol);
    let us = sigmoid(normal_distance, 0.5);
    return us;
}
function normal(x, s, tol) {
    return (x - s) / tol;
}
function sigmoid(x, alpha) {
    return 1 / (1 + Math.exp(-alpha * x));
}
function data() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield DBAsync_1.DBAsync.connectDBAsync("finaldata");
        let coll = yield DBAsync_1.DBAsync.coll(db, "POI_all");
        let pois = yield DBAsync_1.DBAsync.find(coll, {}, {});
        let poi_num = 0;
        for (let poi of pois) {
            let weekTime = vzTaiwan_1.default.weekday_textParsing(poi.open_time);
            let now = new POI_1.default(poi.name, poi.rating, poi._id.toString(), poi.lat, poi.lng, poi.stay_time, weekTime);
            POImap_1.default.insertPoi(now);
            poi_num++;
        }
        Tool_1.default.actionmsg('get POIs from mongodb over');
        Tool_1.default.datanmsg(`number of poi:${poi_num}`);
        coll = yield DBAsync_1.DBAsync.coll(db, "yilanpairwise_all");
        let pairWises = yield DBAsync_1.DBAsync.find(coll, {}, { from: 1, to: 1, distance: 1, travelTime: 1, lineDistance: 1, lineTravelTime: 1 });
        let pairWises_num = 0;
        for (let pairWise of pairWises) {
            POImap_1.default.insertPairEdge(pairWise.from, pairWise.to, pairWise.distance, pairWise.travelTime, pairWise.lineDistance, pairWise.lineTravelTime);
            pairWises_num++;
        }
        Tool_1.default.actionmsg('get pairWises from mongodb over');
        Tool_1.default.datanmsg(`number of pairWise:${pairWises_num}`);
        yield DBAsync_1.DBAsync.closeDB();
    });
}
function exp_data(dbName, collName) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield DBAsync_1.DBAsync.connectDBAsync(dbName);
        let coll = yield DBAsync_1.DBAsync.coll(db, collName);
        let exps = yield DBAsync_1.DBAsync.find(coll, {}, {});
        yield DBAsync_1.DBAsync.closeDB();
        return exps;
    });
}
function save_value(DBname, collName, create_field_datas, setting) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield DBAsync_1.DBAsync.connectDBAsync(DBname);
        let coll = yield DBAsync_1.DBAsync.coll(db, collName);
        let attr_name = "a" + setting.a + "d" + setting.d;
        for (let create_field_data of create_field_datas) {
            yield DBAsync_1.DBAsync.create_field(coll, create_field_data.exp_id, {
                [attr_name]: create_field_data.value
            });
        }
        yield DBAsync_1.DBAsync.closeDB();
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield data();
        POImap_1.default.reverse();
        ini_edge();
        let max_attraction = 5;
        let dbName1 = "chapter6_2_1";
        let collNames1 = ["d+prune+h(8am,8pm)", "a4+d5+prune+h(8am,8pm)", "a4+d10+prune+h(8am,8pm)", "a4+d20+prune+h(8am,8pm)",
            "a3.5+d20+prune+h(8am,8pm)", "a4.5+d20+prune+h(8am,8pm)"];
        let dbName2 = "chapter5";
        let collNames2 = ["a+prune+h(8am,8pm)"];
        let dbName3 = "chapter6_2_2_Limit5mins";
        let collNames3 = ["xxx", "a4+d5(8am,8pm)", "a4+d10(8am,8pm)", "a4+d20(8am,8pm)",
            "a3.5+d20(8am,8pm)", "a4.5+d20(8am,8pm)"];
        let dbName4 = "chapter8";
        let collNames4 = ["xxx", "a4+d5+prune+h+tuning0.05(8am,8pm)", "a4+d10+prune+h+tuning0.05(8am,8pm)", "a4+d20+prune+h+tuning0.05(8am,8pm)",
            "a3.5+d20+prune+h+tuning0.05(8am,8pm)", "a4.5+d20+prune+h+tuning0.05(8am,8pm)"];
        let setting = [{}, { a: 4, d: 5 }, { a: 4, d: 10 }, { a: 4, d: 20 }, { a: 3.5, d: 20 }, { a: 4.5, d: 20 }];
        let dbName = dbName4;
        let collNames = collNames4;
        for (let set = 1; set <= 5; set++) {
            console.log(`set:${set}`);
            let indexs = [0, set];
            let satisfy = {
                s_distance: setting[set].d,
                s_attraction: max_attraction - setting[set].a,
                tol_distance: 1,
                tol_attraction: 0.1
            };
            for (let index of indexs) {
                let exps = yield exp_data(dbName, collNames[index]);
                console.log(dbName, collNames[index]);
                console.log(`result_data_length: ${exps.length}\n`);
                let create_field_datas = calculate_path_value(exps, satisfy);
                yield save_value(dbName, collNames[index], create_field_datas, setting[set]);
            }
        }
    });
}
run();
