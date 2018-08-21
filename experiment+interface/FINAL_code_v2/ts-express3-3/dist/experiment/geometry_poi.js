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
const DBAsync_1 = require("../database/DBAsync");
function data() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield DBAsync_1.DBAsync.connectDBAsync("finaldata");
        let coll = yield DBAsync_1.DBAsync.coll(db, "POI_all");
        let pois = yield DBAsync_1.DBAsync.find(coll, {}, {});
        yield DBAsync_1.DBAsync.closeDB();
        return pois;
    });
}
function save_testDataNames(DBname, newDatas, collname) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield DBAsync_1.DBAsync.connectDBAsync(DBname);
        let coll = yield DBAsync_1.DBAsync.coll(db, collname);
        yield DBAsync_1.DBAsync.insertMany(coll, newDatas);
        yield DBAsync_1.DBAsync.closeDB();
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let pois = yield data();
        let new_pois = [];
        for (let poi of pois) {
            console.log(poi.name, poi.lat, poi.lng, poi._id);
            new_pois.push({
                "_id": poi._id,
                "name": poi.name,
                "placeID": poi.placeID,
                "city": poi.city,
                "address": poi.address,
                "loc": {
                    "lng": poi.lng,
                    "lat": poi.lat
                },
                "stay_time": poi.stay_time,
                "open_time": poi.open_time,
                "introduction": poi.introduction,
                "rating": poi.rating,
                "class": poi.class,
                "price": poi.price,
                "value": poi.value,
                "tag": poi.tag,
                "autotag": poi.autotag,
                "type": poi.type
            });
        }
        yield save_testDataNames("explore", new_pois, "geometry_poi");
    });
}
run();
