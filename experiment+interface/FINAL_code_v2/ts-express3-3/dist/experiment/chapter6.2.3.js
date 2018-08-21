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
const Vector_1 = require("../algorithm/Vector");
const Node_1 = require("../algorithm/Node");
const POI_1 = require("../algorithm/POI");
const POImap_1 = require("../algorithm/POImap");
const Astar_1 = require("../algorithm/Astar");
const Time_1 = require("../algorithm/Time");
const vzTaiwan_1 = require("../preprocess/vzTaiwan");
const Tool_1 = require("../algorithm/Tool");
const DBAsync_1 = require("../database/DBAsync");
class chapter6_2_3 {
    constructor() {
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let run_start = new Date;
            let DBname = "chapter6_2_3";
            let expSettings = [
                {
                    DBname: DBname,
                    expName: "a4+d20+t0.5+prune+h(8am,8pm)",
                    attribution: [Node_1.default.index_attraction, Node_1.default.index_distance, Node_1.default.index_travelTime],
                    attraction_heuristic: true,
                    distance_heuristic: true,
                    travelTime_heuristic: true,
                    edgeExcept_heuristic: false,
                    attraction_expect_type: "attraction_expect_square",
                    dataStructure: "minheap",
                    openlist_comparator: "comparater_heap_sum",
                    km15: false,
                    nodeLimitNumber: 0,
                    considerWeekTime: true,
                    considerReasonable: true,
                    validateEnd: false,
                    user_specify: true,
                    attr_unit_mean: [4, 20, 0.5],
                    attr_unit_sd: [0.1, 1, 0.25],
                    start_time: 8,
                    duration: 12,
                    tuning: false
                }
            ];
            let minDepth = 2;
            let maxDepth = 7;
            for (let expSettingIndex = 0; expSettingIndex <= 0; expSettingIndex++) {
                let testDataNames = yield this.getTestDataNames();
                let random_times = testDataNames.length;
                random_times = 100;
                console.log(`number of testDataNames:${random_times}`);
                let start_index = 0;
                let end_index = random_times - 1;
                for (let i = start_index; i <= end_index; i++) {
                    for (let depth = minDepth; depth <= maxDepth; depth++) {
                        yield this.data();
                        let run_now = new Date;
                        let total_duration = run_now.getTime() - run_start.getTime();
                        Tool_1.default.expmsg(`------------------------------------------------`);
                        Tool_1.default.expmsg(`start exp time:${new Date()}`);
                        Tool_1.default.expmsg(`expSettingIndex:${expSettingIndex}`);
                        Tool_1.default.expmsg(`DBname:${expSettings[expSettingIndex].DBname}`);
                        Tool_1.default.expmsg(`expName:${expSettings[expSettingIndex].expName}`);
                        Tool_1.default.expmsg(`exp_duration:${JSON.stringify(Time_1.default.millionToDetail(total_duration))}`);
                        Tool_1.default.expmsg(`expSettingIndex:${expSettingIndex},index:${i},depth:${depth}`);
                        let start_id = POImap_1.default.findFromPOImapByName(testDataNames[i].startName);
                        let destination_id = POImap_1.default.findFromPOImapByName(testDataNames[i].destinationName);
                        let start_time = new Time_1.default(undefined, 2017, 10, 30, expSettings[expSettingIndex].start_time, 0, 0);
                        let time_budget = expSettings[expSettingIndex].duration;
                        let orderIndex = expSettings[expSettingIndex].attribution;
                        let setting = this.setting(start_id, destination_id, start_time, time_budget, depth, orderIndex, 60 * 1000, expSettings[expSettingIndex]);
                        let request = setting[0];
                        let constraint = setting[1];
                        let result = this.excute(request, constraint);
                        yield this.saveDB(expSettings[expSettingIndex].DBname, expSettings[expSettingIndex].expName, i, result, time_budget, depth, expSettings[expSettingIndex]);
                    }
                }
            }
        });
    }
    data() {
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
    setting(start_id, destination_id, start_time, time_budget, depth, orderIndex, exp_wait, expSetting) {
        let end_time = start_time.add(time_budget, "hour");
        let request = {
            start_time: start_time,
            end_time: end_time,
            start_id: start_id,
            destination_id: destination_id,
            orderIndex: orderIndex,
            depthLimit: depth
        };
        let constraint = {
            distanceLimit: false,
            timer: false
        };
        if (expSetting.attraction_heuristic) {
            constraint.attraction_expect_heuristic = true;
        }
        if (expSetting.distance_heuristic) {
            constraint.distance_heuristic = true;
        }
        if (expSetting.travelTime_heuristic) {
            constraint.travelTime_heuristic = true;
        }
        if (expSetting.edgeExcept_heuristic) {
            constraint.edgeExcept_heuristic = true;
        }
        if (expSetting.dataStructure == "minheap") {
            constraint.structure_minheap = true;
        }
        if (expSetting.openlist_comparator == "comparator_heap") {
            constraint.comparator_heap = true;
        }
        if (expSetting.openlist_comparator == "comparater_heap_sigmoid") {
            constraint.comparater_heap_sigmoid = true;
        }
        if (expSetting.openlist_comparator == "comparater_heap_normal_sigmoid") {
            constraint.comparater_heap_normal_sigmoid = true;
        }
        if (expSetting.openlist_comparator == "comparater_heap_sum") {
            constraint.comparater_heap_sum = true;
        }
        constraint.km15 = expSetting.km15;
        if (expSetting.nodeLimitNumber != 0) {
            constraint.nodeLimit = true;
            request.nodeLimitNumber = expSetting.nodeLimitNumber;
        }
        if (expSetting.considerWeekTime) {
            constraint.considerWeekTime = true;
        }
        if (expSetting.considerReasonable) {
            constraint.considerReasonable = true;
        }
        if (expSetting.validateEnd) {
            constraint.validateEnd = true;
        }
        if (expSetting.attraction_expect_type == "attraction_expect_square") {
            constraint.attraction_expect_square = true;
        }
        if (expSetting.attraction_expect_type == "attraction_expect_userSpecify")
            constraint.attraction_expect_userSpecify = true;
        if (expSetting.user_specify) {
            constraint.user_specify = true;
            request.attr_unit_mean = expSetting.attr_unit_mean.slice();
            request.attr_unit_sd = expSetting.attr_unit_sd.slice();
        }
        return [request, constraint];
    }
    excute(request, constraint) {
        let astar = new Astar_1.default(request, constraint);
        let run_start = new Date;
        let Result = astar.search();
        let run_end = new Date;
        POImap_1.default.clear();
        Vector_1.default.clear();
        Tool_1.default.expmsg(`path:${Result.pathString}`);
        Tool_1.default.expmsg(`description:${Result.description}`);
        Result.excutionTime = run_end.getTime() - run_start.getTime();
        return Result;
    }
    saveDB(DBname, expName, index, Result, time_budget, depth, expSetting) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield DBAsync_1.DBAsync.connectDBAsync(DBname);
            let coll = yield DBAsync_1.DBAsync.coll(db, expName);
            let exp = {
                index: index,
                Result: Result,
                depth: depth,
                expSetting: expSetting
            };
            yield DBAsync_1.DBAsync.insert(coll, exp);
            yield DBAsync_1.DBAsync.closeDB();
        });
    }
    getTestDataNames() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield DBAsync_1.DBAsync.connectDBAsync("paper-data");
            let coll = yield DBAsync_1.DBAsync.coll(db, "8am-11pm");
            let data = yield DBAsync_1.DBAsync.find(coll, {}, {});
            let testDataNames = [];
            for (let testDataName of data) {
                testDataNames.push(testDataName);
            }
            yield DBAsync_1.DBAsync.closeDB();
            return testDataNames;
        });
    }
}
let expAsync = new chapter6_2_3();
expAsync.run();
