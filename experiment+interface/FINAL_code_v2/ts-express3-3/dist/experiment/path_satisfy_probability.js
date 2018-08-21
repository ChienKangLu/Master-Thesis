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
function ini_attration() {
    let attration_sum = 0;
    let attration_mean = 0;
    let N = POImap_1.default.pois.length;
    for (let poi of POImap_1.default.pois) {
        attration_sum += poi.global_attraction;
    }
    attration_mean = attration_sum / N;
    let data = {
        mean: attration_mean,
        sum: attration_sum
    };
    return data;
}
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
function ini_edge_mv() {
    let N = POImap_1.default.pois.length;
    let dis_sum = 0;
    let travelTime_sum = 0;
    for (let from in POImap_1.default.pairEdge) {
        for (let to in POImap_1.default.pairEdge[from]) {
            dis_sum += POImap_1.default.pairEdge[from][to].distance;
            travelTime_sum += POImap_1.default.pairEdge[from][to].travelTime;
        }
    }
    let dis_mean = 0;
    let travelTime_mean = 0;
    dis_mean = dis_sum / (N * N);
    travelTime_mean = travelTime_sum / (N * N);
    let dis_data = {
        sum: dis_sum,
        mean: dis_mean
    };
    let travelTime_data = {
        sum: travelTime_sum,
        mean: travelTime_mean
    };
    return [dis_data, travelTime_data];
}
function calculate_path_satisfy_probability(exps, dis_data, travelTime_data, attraction_data) {
    let create_field_datas = [];
    for (let exp of exps) {
        create_field_datas.push(path_satisfy_probability(exp._id.toString(), exp.index, exp.Result, dis_data, travelTime_data, attraction_data));
    }
    return create_field_datas;
}
function path_satisfy_probability(exp_id, exp_index, Result, dis_data, travelTime_data, attraction_data) {
    let path = Result.path;
    let depthLimit = Result.depthLimit;
    let probability = 0;
    for (let node of path) {
        if (node.depth != 0 && node.depth < depthLimit) {
            let parent_id = node.parent.poi._id;
            let now_id = node.poi._id;
            let attraction = node.poi.global_attraction;
            let dis = POImap_1.default.pairEdge[parent_id][now_id].distance;
            let travelTime = POImap_1.default.pairEdge[parent_id][now_id].travelTime;
            let alpha = 0.2;
            probability = probability + sigmoid_min(dis, dis_data.mean, alpha) + sigmoid_max(attraction, attraction_data.mean, alpha) + sigmoid_min(travelTime, travelTime_data.mean, alpha);
        }
    }
    let data = {
        exp_id: exp_id,
        exp_index: exp_index,
        probability: probability
    };
    return data;
}
function sigmoid_min(x, mean, alpha) {
    return Math.exp(alpha * (-x + mean)) / (1 + Math.exp(alpha * (-x + mean)));
}
function sigmoid_max(x, mean, alpha) {
    return 1 / (1 + Math.exp(-x + mean));
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
function save_probability(DBname, collName, create_field_datas) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield DBAsync_1.DBAsync.connectDBAsync(DBname);
        let coll = yield DBAsync_1.DBAsync.coll(db, collName);
        for (let create_field_data of create_field_datas) {
            yield DBAsync_1.DBAsync.create_field(coll, create_field_data.exp_id, {
                "probability": create_field_data.probability
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
        let edge_mv = ini_edge_mv();
        let dis_data = edge_mv[0];
        let travelTime_data = edge_mv[1];
        let attraction_data = ini_attration();
        let dbName = "exp_final";
        let collNames = ["a+h+prune", "d+h+prune", "t+h+prune", "a+d+h+prune", "a+d+t+h+prune"];
        for (let collName of collNames) {
            let exps = yield exp_data(dbName, collName);
            console.log(`result_data_length: ${exps.length}\n`);
            let create_field_datas = calculate_path_satisfy_probability(exps, dis_data, travelTime_data, attraction_data);
            yield save_probability(dbName, collName, create_field_datas);
        }
    });
}
run();
