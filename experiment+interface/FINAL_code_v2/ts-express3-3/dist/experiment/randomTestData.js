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
const Time_1 = require("../algorithm/Time");
const vzTaiwan_1 = require("../preprocess/vzTaiwan");
const Tool_1 = require("../algorithm/Tool");
const DBAsync_1 = require("../database/DBAsync");
let start_time = new Time_1.default(undefined, 2017, 10, 30, 8, 0, 0);
function data(start_time) {
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
        POImap_1.default.set_realTimes(start_time);
        Tool_1.default.actionmsg('get POIs from mongodb over');
        Tool_1.default.datanmsg(`number of poi:${poi_num}`);
        yield DBAsync_1.DBAsync.closeDB();
    });
}
function filterTime(start_time, AM, PM) {
    return __awaiter(this, void 0, void 0, function* () {
        let nowWeek = start_time.time.getDay();
        let pois_new = [];
        Tool_1.default.datanmsg(`nowWeek:${nowWeek}`);
        for (let poi of POImap_1.default.pois) {
            let dayTime = poi.weekTime[nowWeek];
            for (let timeStatus_index in dayTime) {
                let timeStatus = dayTime[timeStatus_index];
                if (timeStatus.status == "Open24hours") {
                    pois_new.push(poi);
                    break;
                }
                else if (timeStatus.status == "Open") {
                    let openTimeString = timeStatus.open;
                    let closeTimeString = timeStatus.close;
                    if (openTimeString.hour <= AM && openTimeString.stamp == "AM" &&
                        closeTimeString.hour >= PM && closeTimeString.stamp == "PM") {
                        pois_new.push(poi);
                        break;
                    }
                    else {
                    }
                }
            }
        }
        POImap_1.default.pois = pois_new;
    });
}
function randomIndex(randomNum) {
    return __awaiter(this, void 0, void 0, function* () {
        let poiNumber = POImap_1.default.pois.length;
        let random_pairs = [];
        for (let i = 0; i < randomNum; i++) {
            let same = true;
            while (same) {
                same = false;
                let from_idx = Tool_1.default.getRandomInt(0, poiNumber - 1);
                let to_idx = Tool_1.default.getRandomIntWithout(0, poiNumber - 1, from_idx);
                random_pairs[i] = {
                    from_idx: from_idx,
                    to_idx: to_idx
                };
                for (let j = 0; j < i - 1; j++) {
                    if (random_pairs[i].from_idx == random_pairs[j].from_idx && random_pairs[i].to_idx == random_pairs[j].to_idx) {
                        same = true;
                        break;
                    }
                }
            }
        }
        return random_pairs;
    });
}
function random_pairs2testDataNames(random_pairs) {
    return __awaiter(this, void 0, void 0, function* () {
        let testDataNames = [];
        for (let [index, random_pair] of random_pairs.entries()) {
            testDataNames.push({
                'index': index,
                'startName': POImap_1.default.pois[random_pair.from_idx].name,
                'destinationName': POImap_1.default.pois[random_pair.to_idx].name
            });
        }
        return testDataNames;
    });
}
function save_testDataNames(DBname, testDataNames, collname) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield DBAsync_1.DBAsync.connectDBAsync(DBname);
        let coll = yield DBAsync_1.DBAsync.coll(db, collname);
        yield DBAsync_1.DBAsync.insertMany(coll, testDataNames);
        yield DBAsync_1.DBAsync.closeDB();
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        Tool_1.default.datanmsg(`${start_time.toString()}`);
        yield data(start_time);
        yield filterTime(start_time, 8, 11);
        Tool_1.default.datanmsg(`number of poi after filter:${POImap_1.default.pois.length}`);
        let random_pairs = yield randomIndex(1000);
        Tool_1.default.datanmsg(`number of random_pairs:${random_pairs.length}`);
        let testDataNames = yield random_pairs2testDataNames(random_pairs);
        let DBname = "paper-data";
        let collname = "8am-11pm";
        yield save_testDataNames(DBname, testDataNames, collname);
    });
}
run();
