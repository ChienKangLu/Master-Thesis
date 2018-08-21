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
const mongodb_1 = require("mongodb");
let start_time = new Time_1.default(undefined, 2017, 10, 30, 8, 0, 0);
function createPOI(name, city, address, lat, lng, stay_time, weekday_text, introduction, rating) {
    let data = {
        "name": name,
        "city": city,
        "address": address,
        "lat": lat,
        "lng": lng,
        "stay_time": stay_time,
        "open_time": {
            "open_now": true,
            "weekday_text": weekday_text
        },
        "introduction": introduction,
        "rating": rating
    };
    return data;
}
function save_datas(DBname, collName, datas) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield DBAsync_1.DBAsync.connectDBAsync(DBname);
        let coll = yield DBAsync_1.DBAsync.coll(db, collName);
        yield DBAsync_1.DBAsync.insertMany(coll, datas);
        yield DBAsync_1.DBAsync.closeDB();
    });
}
function data(start_time) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield DBAsync_1.DBAsync.connectDBAsync("dating");
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
function getDistance(lat1, lng1, lat2, lng2) {
    var dis = 0;
    var radLat1 = toRadians(lat1);
    var radLat2 = toRadians(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRadians(lng1) - toRadians(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;
}
function toRadians(d) { return d * Math.PI / 180; }
function createPairWise(speed, real_rate) {
    return __awaiter(this, void 0, void 0, function* () {
        let datas = [];
        for (let from of POImap_1.default.pois) {
            for (let to of POImap_1.default.pois) {
                let from_objectId = new mongodb_1.ObjectID(from._id);
                let to_objectId = new mongodb_1.ObjectID(to._id);
                let distance = (getDistance(from.lat, from.lng, to.lat, to.lng) * real_rate) / 1000;
                let travelTime = distance / speed;
                let data = {
                    "from": from_objectId,
                    "to": to_objectId,
                    "distance": distance,
                    "travelTime": travelTime
                };
                datas.push(data);
            }
        }
        yield save_datas("dating", "pairwise_all", datas);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let poi1 = createPOI("海灣星空咖啡館", "桃園縣", "桃園縣蘆竹鄉山腳村7鄰山腳81-6號", 25.102361, 121.291342, 1, [
            "Monday: 3:00 PM – 1:00 AM",
            "Tuesday: 3:00 PM – 1:00 AM",
            "Wednesday: 3:00 PM – 1:00 AM",
            "Thursday: 3:00 PM – 1:00 AM",
            "Friday: 3:00 PM – 1:00 AM",
            "Saturday: 11:00 – 1:00 AM",
            "Sunday: 11:00 – 1:00 PM"
        ], "", 5);
        let poi2 = createPOI("覓燒肉", "桃園市", "桃園市桃園區莊敬路一段313號", 25.025452, 121.300420, 1, [
            "Monday: Closed",
            "Tuesday: 5:00 PM – 00:00 AM",
            "Wednesday: 5:00 PM – 00:00 AM",
            "Thursday: 5:00 PM – 00:00 AM",
            "Friday: 5:00 PM – 00:00 AM",
            "Saturday: 12:00 – 3:00 PM, 5:00 PM – 00:00 AM",
            "Sunday: 12:00 – 3:00 PM, 5:00 PM – 00:00 AM"
        ], "", 5);
        let poi3 = createPOI("齋明寺賞櫻", "桃園市", "桃園市大溪區齋明街153號", 24.889176, 121.274029, 1, [
            "Monday: 9:00 AM – 5:00 PM",
            "Tuesday: 9:00 AM – 5:00 PM",
            "Wednesday: 9:00 AM – 5:00 PM",
            "Thursday: 9:00 AM – 5:00 PM",
            "Friday: 9:00 AM – 5:00 PM",
            "Saturday: 9:00 AM – 5:00 PM",
            "Sunday: 9:00 AM – 5:00 PM"
        ], "", 5);
        let poi4 = createPOI("大溪老街", "桃園市", "桃園市大溪區大溪橋步道", 24.884918, 121.284541, 1, [
            "Monday: 7:00 AM – 5:00 PM",
            "Tuesday: 7:00 AM – 5:00 PM",
            "Wednesday: 7:00 AM – 5:00 PM",
            "Thursday: 7:00 AM – 5:00 PM",
            "Friday: 7:00 AM – 5:00 PM",
            "Saturday: 7:00 AM – 5:00 PM",
            "Sunday: 7:00 AM – 5:00 PM"
        ], "", 5);
        let poi5 = createPOI("富田花園農場", "桃園縣", "桃園縣大溪鎮福安里埤尾22-8號", 24.839497, 121.288128, 1, [
            "Monday: 9:00 AM – 6:00 PM",
            "Tuesday: 9:00 AM – 6:00 PM",
            "Wednesday: 9:00 AM – 6:00 PM",
            "Thursday: 9:00 AM – 6:00 PM",
            "Friday: 9:00 AM – 6:00 PM",
            "Saturday: 9:00 AM – 6:00 PM",
            "Sunday: 9:00 AM – 6:00 PM"
        ], "", 5);
        let poi6 = createPOI("SNOOPY Play Center", "桃園市", "桃園市中壢區春德路189號", 25.014572, 121.212705, 1, [
            "Monday: 10:00 AM – 9:00 PM",
            "Tuesday: 10:00 AM – 9:00 PM",
            "Wednesday: 10:00 AM – 9:00 PM",
            "Thursday: 10:00 AM – 9:00 PM",
            "Friday: 10:00 AM – 10:00 PM",
            "Saturday: 10:00 AM – 10:00 PM",
            "Sunday: 10:00 AM – 9:00 PM"
        ], "", 5);
        let poi7 = createPOI("慧縈家", "台北市", "台北市內湖區瑞光路122巷41弄10號", 25.071741, 121.579868, 1, null, "", 5);
        let pois = [poi1, poi2, poi3, poi4, poi5, poi6, poi7];
        yield data(start_time);
        yield createPairWise(50, 1.3);
    });
}
run();
