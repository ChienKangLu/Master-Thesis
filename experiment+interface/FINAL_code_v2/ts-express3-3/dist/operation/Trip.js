"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("../algorithm/Vector");
const POI_1 = require("../algorithm/POI");
const POImap_1 = require("../algorithm/POImap");
const Astar_1 = require("../algorithm/Astar");
const Time_1 = require("../algorithm/Time");
const vzTaiwan_1 = require("../preprocess/vzTaiwan");
const Tool_1 = require("../algorithm/Tool");
class Trip {
    static getPath(POIs, PairWises, start_id, destination_id, start_time, end_time, sort, depthLimit, heuristic_gate, km15_gate, callback) {
        let poi_num = 0;
        for (let poi of POIs) {
            let weekTime = vzTaiwan_1.default.weekday_textParsing(poi.open_time);
            let now = new POI_1.default(poi.name, poi.rating, poi._id.toString(), poi.lat, poi.lng, poi.stay_time, weekTime);
            POImap_1.default.insertPoi(now);
            poi_num++;
        }
        Tool_1.default.actionmsg('get POIs from mongodb over');
        Tool_1.default.datanmsg(`number of poi:${poi_num}`);
        let pairWises_num = 0;
        for (let pairWise of PairWises) {
            POImap_1.default.insertPairEdge(pairWise.from, pairWise.to, pairWise.distance, pairWise.travelTime, pairWise.lineDistance, pairWise.lineTravelTime);
            pairWises_num++;
        }
        Tool_1.default.actionmsg('get pairWises from mongodb over');
        Tool_1.default.datanmsg(`number of pairWise:${pairWises_num}`);
        let request = {
            start_time: new Time_1.default(start_time),
            end_time: new Time_1.default(end_time),
            start_id: start_id,
            destination_id: destination_id,
            orderIndex: sort,
            depthLimit: parseInt("" + depthLimit),
            nodeLimitNumber: 30000
        };
        let constraint = {
            considerWeekTime: true,
            considerReasonable: true,
            structure_minheap: true,
            comparator_heap: true,
            nodeLimit: true
        };
        if (heuristic_gate == "true") {
            constraint.attraction_expect_heuristic = true;
            console.log("attraction expect_heuristic");
        }
        else {
            console.log("attraction non_heuristic");
        }
        if (km15_gate == "true") {
            constraint.km15 = true;
        }
        let astar = new Astar_1.default(request, constraint);
        let run_start = new Date;
        let Result = astar.search();
        let run_end = new Date;
        POImap_1.default.clear();
        Vector_1.default.clear();
        Tool_1.default.datanmsg(`run time:${JSON.stringify(Time_1.default.millionToDetail(run_end.getTime() - run_start.getTime()))}`);
        Result.excutionTime = run_end.getTime() - run_start.getTime();
        callback(Result);
    }
}
exports.Trip = Trip;
