"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const POI_1 = require("../algorithm/POI");
const POImap_1 = require("../algorithm/POImap");
const DB_1 = require("../database/DB");
const vzTaiwan_1 = require("../preprocess/vzTaiwan");
const Tool_1 = require("../algorithm/Tool");
const HMM_1 = require("../algorithm/HMM");
class Test_HMM {
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
                    POImap_1.default.reverse();
                    let N = POImap_1.default.pois.length;
                    let T = 3;
                    let A = [];
                    let score = [];
                    let from_idx = 0;
                    for (let from in POImap_1.default.pairEdge) {
                        A[from_idx] = [];
                        let to_idx = 0;
                        for (let to in POImap_1.default.pairEdge[from]) {
                            let distance = POImap_1.default.pairEdge[from][to].distance;
                            let travelTime = POImap_1.default.pairEdge[from][to].travelTime;
                            let d = distance;
                            A[from_idx][to_idx] = d;
                            to_idx++;
                        }
                        from_idx++;
                    }
                    Tool_1.default.actionmsg(`Compute A by distance for HMM`);
                    for (let i = 0; i < N; i++) {
                        let sum = 0;
                        for (let j = 0; j < N; j++) {
                            sum += A[i][j];
                        }
                        for (let j = 0; j < N; j++) {
                            A[i][j] = A[i][j] / sum;
                        }
                    }
                    Tool_1.default.actionmsg(`Normaline A for HMM`);
                    let go = true;
                    let id_dictionary = [];
                    if (go) {
                        let idx = 0;
                        for (let from in POImap_1.default.pairEdge) {
                            console.log(`${from},${POImap_1.default.pois[idx]._id},${from == POImap_1.default.pois[idx]._id}`);
                            id_dictionary[idx] = POImap_1.default.pois[idx]._id;
                            idx++;
                        }
                    }
                    for (let i = 0; i < N; i++) {
                        score[i] = POImap_1.default.pois[i].global_attraction_cost;
                        console.log(`${i}:${POImap_1.default.pois[i].name},${POImap_1.default.pois[i].global_attraction_cost}`);
                    }
                    Tool_1.default.actionmsg(`Compute score for HMM`);
                    let hmm = new HMM_1.default(N, T, A, score);
                    let beta = hmm.back_expectation(0, 3);
                    Tool_1.default.actionmsg(`Finsih back_expectation for HMM`);
                    let time_city_expectation = [];
                    for (let t = 0; t < T; t++) {
                        let map = {};
                        for (let n = 0; n < N; n++) {
                            map[id_dictionary[n]] = beta[t][n];
                        }
                        time_city_expectation[t] = map;
                    }
                    console.log(JSON.stringify(time_city_expectation, null, 4));
                    Tool_1.default.actionmsg(`Transfer beta structure to time-city_id-expectaion`);
                    callback();
                });
            });
        });
    }
}
exports.Test_HMM = Test_HMM;
