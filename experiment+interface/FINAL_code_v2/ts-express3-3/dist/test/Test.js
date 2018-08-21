"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("../algorithm/Vector");
const Node_1 = require("../algorithm/Node");
const POI_1 = require("../algorithm/POI");
const POImap_1 = require("../algorithm/POImap");
const Astar_1 = require("../algorithm/Astar");
const DB_1 = require("../database/DB");
const Time_1 = require("../algorithm/Time");
const vzTaiwan_1 = require("../preprocess/vzTaiwan");
const Tool_1 = require("../algorithm/Tool");
class Test {
    constructor() {
    }
    run(callback) {
        DB_1.DB.connectDB("poitest", (db) => {
            DB_1.DB.select(db, `poi`, {}, {}, (db, items) => {
                let poi_num = 0;
                for (let poi of items) {
                    let weekTime = vzTaiwan_1.default.weekday_textParsing(poi.open_time);
                    let now = new POI_1.default(poi.name, poi.rating, poi._id, poi.lat, poi.lng, poi.stay_time, weekTime);
                    POImap_1.default.insertPoi(now);
                    poi_num++;
                }
                Tool_1.default.actionmsg('get POIs from mongodb over');
                Tool_1.default.datanmsg(`number of poi:${poi_num}`);
                DB_1.DB.select(db, `pairWise`, { from: 1, to: 1, distance: 1, travelTime: 1 }, {}, (db, items) => {
                    let pairWises_num = 0;
                    for (let pairWise of items) {
                        POImap_1.default.insertPairEdge(pairWise.from, pairWise.to, pairWise.distance, pairWise.travelTime);
                        pairWises_num++;
                    }
                    Tool_1.default.actionmsg('get pairWises from mongodb over');
                    Tool_1.default.datanmsg(`number of pairWise:${pairWises_num}`);
                    DB_1.DB.closeDB(db);
                    let request = {
                        start_time: new Time_1.default(undefined, 2017, 10, 30, 8, 0, 0),
                        end_time: new Time_1.default(undefined, 2017, 10, 30, 22, 30, 0),
                        start_id: "59cde0b1d63dcb07700d1c39",
                        destination_id: "59cde0b3d63dcb07700d1c54",
                        orderIndex: [Node_1.default.index_attraction],
                        depthLimit: 10,
                        mustVisit_order: [{ _id: "59cde0b3d63dcb07700d1c54", order: 10 }]
                    };
                    let constraint = {
                        considerWeekTime: true,
                        considerMustVisit_order: true
                    };
                    let astar = new Astar_1.default(request, constraint);
                    let run_start = new Date;
                    let Result = astar.search();
                    let run_end = new Date;
                    POImap_1.default.clear();
                    Vector_1.default.clear();
                    Tool_1.default.datanmsg(`run time:${JSON.stringify(Time_1.default.millionToDetail(run_end.getTime() - run_start.getTime()))}`);
                    Result.excutionTime = run_end.getTime() - run_start.getTime();
                    callback(Result);
                });
            });
        });
    }
    test() {
    }
    process() {
        console.log("----test MongoDB + Astar----");
        POImap_1.default.clear();
        let insertRun = false;
        if (insertRun) {
            console.log(`select all poi, and insert pairWise ,velocity is set 70km/hr`);
            DB_1.DB.connectDB("poitest", (db) => {
                DB_1.DB.select(db, `poi`, { name: 1, lat: 1, lng: 1 }, {}, (db, items) => {
                    let insertObj = [];
                    let index = 0;
                    for (let from of items) {
                        for (let to of items) {
                            let distance = DB_1.DB.getDistance(from.lat, from.lng, to.lat, to.lng) / 1000;
                            let velocity = 70;
                            let temp = { from: from._id, to: to._id, distance: distance, travelTime: distance / velocity };
                            insertObj[index] = temp;
                            index++;
                        }
                    }
                    DB_1.DB.insert(db, 'pairWise', insertObj, (db => {
                        DB_1.DB.closeDB(db);
                    }));
                });
            });
        }
        console.log(`select all poi(open_time.weekday_text)`);
        let timeJudge = false;
        if (timeJudge) {
            DB_1.DB.connectDB("poitest", (db) => {
                DB_1.DB.select(db, `poi`, { 'open_time.weekday_text': 1 }, {}, (db, items) => {
                    let index = 0;
                    let stringArray = [];
                    for (let poi of items) {
                        if (poi.open_time != null) {
                            for (let day of poi.open_time.weekday_text) {
                                let temp = day.split(" ");
                                temp.shift();
                                let saveS = "";
                                for (let s of temp) {
                                    saveS += s;
                                }
                                stringArray.push(saveS);
                            }
                            index++;
                        }
                    }
                    stringArray.sort();
                    for (let s of stringArray) {
                        console.log(s);
                    }
                    console.log(`stringArray length:${stringArray.length}`);
                    console.log(`number of poi not null open_time:${index}/${items.length}`);
                    DB_1.DB.closeDB(db);
                });
            });
        }
    }
    comparator(left, right) {
        for (let i = 0; i < Vector_1.default.dim; i++) {
            if (left.f.data[Vector_1.default.orderIndex[i]] < right.f.data[Vector_1.default.orderIndex[i]]) {
                return 1;
            }
            else if (left.f.data[Vector_1.default.orderIndex[i]] > right.f.data[Vector_1.default.orderIndex[i]]) {
                return -1;
            }
        }
        return 0;
    }
}
exports.Test = Test;
